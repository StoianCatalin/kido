import {Component, OnInit, Input} from '@angular/core';
import {ParentService} from "../services/parent.service";
import {LocationService} from "../../commons/services/location/location.service";
import {Marker} from "../../commons/models/marker";
import {AuthService} from "../../commons/services/auth/auth.service";
import {User} from "../../commons/models/user";
import {LatLngLiteral} from "@agm/core";
import {AreaService} from "../services/area.service";

@Component({
  selector: 'km-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {

  lat: number;
  lng: number;
  zoom: number = 16;
  markers: Marker[] = [];
  me: User;
  socket : any;
  childs: User[];
  historyPoints : any[] = [];
  polygons : Array<Array<LatLngLiteral>> = [];
  circles = [];
  notification = null;
  timeOutNotification = null;

  constructor(
    private parentService: ParentService,
    private locationService: LocationService,
    private authService: AuthService,
    private areaService: AreaService
  ) { }

  ngOnInit() {
    this.initMeAndUsers();
    this.socket = this.authService.getSocket();
    this.initNewConnection();
    this.initMoveOnMap();
    this.initAreas();
    this.listenNotifications();
  }

  /*
   @brief Initializeaza informatiile despre parintele logat + copiii lui.
   @how Face apel la endpoint-uri trangad datele de pe server.
   */
  initMeAndUsers() {
    this.me = this.authService.getUser();
    this.locationService.myCurrentLocation()
      .subscribe((point) => {
        this.lat = point.latitude;
        this.lng = point.longitude;
        this.markers.push(new Marker(this.me.id, this.me.nume + ' ' + this.me.prenume, this.me.type, point.latitude, point.longitude));
      });
    this.parentService.getMyChilds()
      .subscribe((childs) => {
        this.childs = childs;
        childs.forEach((child) => {
          this.markers.push(new Marker(child.id, child.nume + ' ' + child.prenume, child.type, child.locations[0].latitude, child.locations[0].longitude));
        });
      });
  }

  /*
   @brief Asculta daca un copil se conecteaza si il afiseaza pe harta.
   @how Prin websockets.
   */
  initNewConnection() {
    this.socket.on('newConnection', (user) => {
      if (user.id != this.me.id) {
        let markerExist = this.markers.find((item) => {
          return item.id == user.id;
        });
        if (!markerExist) {
          this.childs.push(user);
          this.markers.push(new Marker(user.id, user.nume + ' ' + user.prenume, user.type, user.locations[0].latitude, user.locations[0].longitude));
        }
      }
    });
  }

  /*
   @brief Asculta cand un copil isi schimba pozitia pe harta.
   @how Prin websockets.
   */
  initMoveOnMap() {
    this.socket.on('moveOnMap', (coordinates) => {
      let marker = this.markers.find((mark) => {
        return mark.id == coordinates.id;
      });
      marker.longitude = coordinates.longitude;
      marker.latitude = coordinates.latitude;
      let user = this.childs.find((child) => {
        return child.id == coordinates.id;
      });
      user.locations.unshift(coordinates);
    });
  }

  /*
   @brief Initializeaza toate zonele sigure create pana in acel moment.
   @how Apeland endpoint-uri specifice.
   */
  initAreas() {
    this.polygons = [];
    this.circles = [];
    this.areaService.getPolygonAreas()
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
      });
  }

  /*
   @brief Asculta daca primeste notificari noi de la copiii sai si le afiseaza. Face focus on child.
   @how Prin websockets.
   */
  listenNotifications() {
    this.socket.on('pushNotification', (notification) => {
      this.notification = notification;
      let child = this.childs.find((item) => {
        return item.id == notification.id;
      });
      this.focusOnChild(child);
      this.notification.name = child.nume + " " + child.prenume;
      clearTimeout(this.timeOutNotification);
      this.timeOutNotification = setTimeout(() => {
        this.notification = null;
      }, 5000);
    });
  }

  /*
   @brief Orienteaza harta cu centrul pe locatia unui copil.
   @how Schimba latitudinea si longitudinea centrului hartii.
   */
  focusOnChild(child) {
    let locations = this.markers.find((item) => {
      return item.id == child.id;
    });
    this.lat = locations.latitude;
    this.lng = locations.longitude;
  }

  /*
   @brief Deseneaza pe harta drumul pe unde a mers copilul primit ca parametru.
   @how Folosind google maps API.
   */
  showHistory(child) {
    if (this.historyPoints == child.locations)
      this.historyPoints = [];
    else
      this.historyPoints = child.locations;
  }

  /*
   @brief Sterge un copil.
   @how Apeleaza un endpoint pentru stergerea copilului.
   */
  deleteUser(child) {
    this.parentService.deleteChild(child)
      .subscribe(response => {
        let index = this.markers.findIndex((item) => {
          return item.id == child.id;
        });
        this.markers.splice(index, 1);
        index = this.childs.findIndex((item) => {
          return item.id == child.id;
        });
        this.childs.splice(index, 1);
      });
  }

}
