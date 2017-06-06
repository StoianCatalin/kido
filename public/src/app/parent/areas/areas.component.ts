import {Component, OnInit, ViewChild} from '@angular/core';
import {Marker} from "../../commons/models/marker";
import {LocationService} from "../../commons/services/location/location.service";
import {AuthService} from "../../commons/services/auth/auth.service";
import {User} from "../../commons/models/user";
import {AgmPolygon, LatLngLiteral} from "@agm/core";
import {AreaService} from "../services/area.service";

declare const $ : any;

@Component({
  selector: 'km-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  @ViewChild('map') map;

  lat: number;
  lng: number;
  zoom: number = 16;
  me: User;
  markers: Marker[] = [];
  createModePoly : boolean = false;
  createModeCircle : boolean = false;
  polygons: Array<Array<LatLngLiteral>> = [];
  testPoints : Array<LatLngLiteral> = [];
  circles = [];
  testCircle = {
    longitude: null,
    latitude: null,
    radius: 20
  };
  areas = [];

  constructor(private locationService: LocationService,
              private authService: AuthService,
              private areaService: AreaService) { }

  ngOnInit() {
    $('.tooltiped').popup();
    this.me = this.authService.getUser();
    this.initCurrentLocation();
    this.initAreas();
  }

  initAreas() {
    this.areas = [];
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
          this.areas.push({id: element.id, name: element.name});
        });
      });
  }

  initCurrentLocation() {
    this.locationService.myCurrentLocation()
      .subscribe((point) => {
        this.lat = point.latitude;
        this.lng = point.longitude;
        this.markers.push(new Marker(this.me.id, this.me.nume + ' ' + this.me.prenume, this.me.type, point.latitude, point.longitude));
      });
  }

  removeArea(id : number) {
    this.areaService.removeArea(id)
      .subscribe(() => {
        let index = this.areas.findIndex((item) => {
          return item.id == id;
        });
        this.areas.splice(index, 1);
        this.initAreas();
      });
  }

  togglePolyMode() {
    $('.tooltiped').popup('hide');
    this.createModePoly = !this.createModePoly;
    this.createModeCircle = false;
  }

  toggleCircleMode() {
    $('.tooltiped').popup('hide');
    this.createModeCircle = !this.createModeCircle;
    this.createModePoly = false;
    this.testCircle = {
      longitude: null,
      latitude: null,
      radius: 20
    }
  }

  clickManager({coords}) {
    if (this.createModePoly) {
      this.createPolygone(coords)
    }
    else if (this.createModeCircle) {
      this.createCircle(coords);
    }
  }

  createCircle(coords) {
    this.testCircle.longitude = coords.lng;
    this.testCircle.latitude = coords.lat;
  }

  createPolygone(coords) {
    this.testPoints.push(coords);
  }

  updateTestCircle(radius) {
    this.testCircle.radius = radius;
  }

  updateCenter(coords) {
    this.testCircle.latitude = coords.lat;
    this.testCircle.longitude = coords.lng;
  }

  savePolygon() {
    if (this.testPoints.length > 0) {
      this.polygons.push(this.testPoints);
      this.areaService.createPolygonArea(this.testPoints)
        .subscribe((interesArea) => {
          this.testPoints = [];
          this.areas.push({id: interesArea.id, name: interesArea.name});
        });
    }
    $('.tooltiped').popup('hide');
    this.createModePoly = false;
  }

  saveCircle() {
    this.circles.push(this.testCircle);
    this.areaService.createCircleArea(this.testCircle)
      .subscribe((circle) => {
        this.createModeCircle = false;
        $('.tooltiped').popup('hide');
        this.testCircle = {
          longitude: null,
          latitude: null,
          radius: 20
        }
      });
  }
}
