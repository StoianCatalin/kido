import {Component, OnInit} from '@angular/core';
import {User} from "../../commons/models/user";
import {Marker} from "../../commons/models/marker";
import {AuthService} from "../../commons/services/auth/auth.service";
import {LocationService} from "../../commons/services/location/location.service";
import {ChildService} from "../services/child.service";
import * as io from 'socket.io-client';
import {AreaService} from "../../parent/services/area.service";
import {LatLngLiteral} from "@agm/core";

@Component({
  selector: 'km-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {

  lat: number;
  lng: number;
  zoom: number = 16;
  markers: Marker[] = [];
  me: User;
  parent: User;
  socket : any;
  myMarker: Marker;
  circles = [];
  polygons : Array<Array<LatLngLiteral>> = [];
  safePolygonStatus : boolean = false;
  safeCircleStatus : boolean = false;

  constructor(
    private childService: ChildService,
    private locationService: LocationService,
    private authService: AuthService,
    private areaService: AreaService
  ) { }


  /*
  @brief Este apelata cand componenta este initializata. Initializeaza si aduce de pe backend toate datele necesare. De asemenea porneste evenimentele de ascultate pentru websocket-uri.
  @how Folosindu-se de serviile injectate apeleaza endpoint-urile specifice pentru a aduce informatia de pe server.
   */
  ngOnInit() {
    this.me = this.authService.getUser();
    this.locationService.myCurrentLocation()
      .subscribe((point) => {
        this.lat = point.latitude;
        this.lng = point.longitude;
        this.myMarker = new Marker(this.me.id, this.me.nume + ' ' + this.me.prenume, this.me.type, point.latitude, point.longitude);
        this.markers.push(this.myMarker);
      });
    this.childService.getMyParent()
      .subscribe((parent) => {
        this.parent = parent;
        this.markers.push(new Marker(parent.id, parent.nume + ' ' + parent.prenume, parent.type, parent.locations[0].latitude, parent.locations[0].longitude));
      });
    this.socket = this.authService.getSocket();
    this.socket.on('newConnection', (user) => {
      if (user.id != this.me.id)
        this.markers.push(new Marker(user.id, user.nume + ' ' + user.prenume, user.type, user.locations[0].latitude, user.locations[0].longitude));
    });
    this.initAreas();
    this.listenNewAreas();
    this.listenDeleteAreas();
  }

  /*
   @brief Verifica daca un copil este safe in momentul in care isi schimba locatia.
   @how Folosind algoritmi specifici, vedem daca coordonatele copilului sunt in interiorul zonelor sigure.
   */
  checkSafeStatus() {
    this.polygons.forEach((polygon) => {
      if (!this.safePolygonStatus) {
        this.safePolygonStatus = this.rayCasting(this.myMarker, polygon);
      }
    });
    this.circles.forEach((circle) => {
      if (!this.safeCircleStatus) {
        this.safeCircleStatus = this.pointInCircle(this.myMarker, circle);
      }
    });
  }

  /*
   @brief Aduce de pe backend toate zonele sigure definite de parinte.
   @how Apeland endpoint-ul specific acestei actiuni.
   */
  initAreas() {
    this.circles = [];
    this.polygons = [];
    this.areaService.getMyParentPolygonAreas()
      .subscribe((areas) => {
        areas.forEach((element) => {
          let polygon = [];
          if (element.interespoints[0].radius) {
            this.circles.push({
              latitude: element.interespoints[0].latitude,
              longitude: element.interespoints[0].longitude,
              radius: element.interespoints[0].radius
            });
          }
          else {
            element.interespoints.forEach(point => {
              polygon.push({
                lat: point.latitude,
                lng: point.longitude
              });
            });
            this.polygons.push(polygon);
          }
        });
        this.checkSafeStatus();
      });
  }

  /*
   @brief Muta copilul pe harta intr-o directie specificata.
   @how Adaugand 0.00005 in directia dorita.
   */
  move(direction : string) : void {
    if (direction == 'left'){
      this.myMarker.longitude = this.myMarker.longitude - 0.00005;
    }
    else if (direction == 'right') {
      this.myMarker.longitude = this.myMarker.longitude + 0.00005;
    }
    else if (direction == 'up') {
      this.myMarker.latitude = this.myMarker.latitude + 0.00005;
    }
    else if (direction == 'down') {
      this.myMarker.latitude = this.myMarker.latitude - 0.00005;
    }
    this.checkIfChildIsSafe(this.myMarker);
    this.socket.emit('moveOnMap', {latitude: this.myMarker.latitude, longitude: this.myMarker.longitude});
  }

  /*
   @brief Asculta si adauga daca parintele a definit o noua zona sigura.
   @how Prin intermediul websocket-urilor.
   */
  listenNewAreas() {
    this.socket.on('pushArea', (area) => {
      if (area.type == 'circle') {
        this.addNewCircle(area.points);
      }
      else this.addNewPolygon(area.points);
    });
  }

  /*
   @brief Trimite notificare la parinte daca copilul isi schimba statutul de siguranta.
   @how Facand verificarea pentru fiecare zona sigura definita, iar daca copilul isi schimba statusul, va trimite o notificare la parinte.
   */
  checkIfChildIsSafe(marker) {
    let safePolygonStatus = this.safePolygonStatus;
    let safeCircleStatus = this.safeCircleStatus;
    if (safePolygonStatus) {
      this.polygons.forEach((polygon) => {
        if (!this.rayCasting(marker, polygon)) {
          safePolygonStatus = false;
        }
      });
    }
    else {
      this.polygons.forEach((polygon) => {
        if (this.rayCasting(marker, polygon)) {
          safePolygonStatus = true;
        }
      });
    }
    if (safeCircleStatus) {
      this.circles.forEach((circle) => {
        if (!this.pointInCircle(marker, circle) && this.safeCircleStatus) {
          safeCircleStatus = false;
        }
      });
    }
    else {
      this.circles.forEach((circle) => {
        if (this.pointInCircle(marker, circle)) {
          safeCircleStatus = true;
        }
      });
    }

    if ((!safePolygonStatus && this.safePolygonStatus != safePolygonStatus) || (!safeCircleStatus && this.safeCircleStatus != safeCircleStatus)) {
      this.socket.emit('pushNotification', {
        id: this.me.id,
        color: 'red',
        message: "I'm not safe!",
        icon: 'frown'
      });
    }
    else if ((safePolygonStatus && this.safePolygonStatus != safePolygonStatus) || (safeCircleStatus && this.safeCircleStatus != safeCircleStatus)) {
      this.socket.emit('pushNotification', {
        id: this.me.id,
        color: 'green',
        message: "I'm safe again!",
        icon: 'child'
      });
    }
    this.safeCircleStatus = safeCircleStatus;
    this.safePolygonStatus = safePolygonStatus;
  }

  /*
   @brief Asculta daca parintele a sters o zona de siguranta.
   @how Prin websocket-uri.
   */
  listenDeleteAreas() {
    this.socket.on('deleteArea', (area) => {
      this.initAreas();
    });
  }

  /*
   @brief Functie care adauga o zona sigura de tipul cerc pe harta.
   @how
   */
  addNewCircle(circle) {
    this.circles.push(circle);
  }

  /*
   @brief Functie care adauga o zona sigura de tipul polygon pe harta.
   @how
   */
  addNewPolygon(polygon) {
    this.polygons.push(polygon);
  }

  /*
   @brief Trimite notificare parintelui
   @how Prin websockets emitand in emenimentul pushNotification.
   */
  collisionAlert() {
    this.socket.emit('pushNotification', {
      id: this.me.id,
      color: 'red',
      message: 'has collided with an object.',
      icon: 'bomb'
    });
  }

  /*
   @brief Trimite notificare parintelui
   @how Prin websockets emitand in emenimentul pushNotification.
   */
  groundbreaking() {
    this.socket.emit('pushNotification', {
      id: this.me.id,
      color: 'orange',
      message: 'fell down.',
      icon: ''
    });
  }

  /*
   @brief Trimite notificare parintelui
   @how Prin websockets emitand in emenimentul pushNotification.
   */
  animalNearby() {
    this.socket.emit('pushNotification', {
      id: this.me.id,
      color: 'orange',
      message: 'has a dangerous animal nearby.',
      icon: 'paw'
    });
  }

  /*
   @brief Trimite notificare parintelui
   @how Prin websockets emitand in emenimentul pushNotification.
   */
  imFine() {
    this.socket.emit('pushNotification', {
      id: this.me.id,
      color: 'green',
      message: "I'm fine!",
      icon: 'smile'
    });
  }

  /*
   @brief Verifica daca un punct dat face parte din polygon.
   @how Printr-un algoritm specific.
   */
  rayCasting(point, polygon) : boolean {
    let x = point.latitude, y = point.longitude;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].lat, yi = polygon[i].lng;
      let xj = polygon[j].lat, yj = polygon[j].lng;
      let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };

  /*
   @brief Verifica daca un punct este in raza unui cerc.
   @how Printr-un algoritm specific. Matematica elementara.
   */
  pointInCircle(point, circle) {
    let GOOGLEMAP_ERROR = 10000000000;
    console.log(Math.pow((point.latitude - circle.latitude),2)*GOOGLEMAP_ERROR + Math.pow((point.longitude - circle.longitude), 2)*GOOGLEMAP_ERROR, Math.pow(circle.radius, 2));
    return Math.pow((point.latitude - circle.latitude),2)*GOOGLEMAP_ERROR + Math.pow((point.longitude - circle.longitude), 2)*GOOGLEMAP_ERROR <= Math.pow(circle.radius, 2) + 1500;
  }
}
