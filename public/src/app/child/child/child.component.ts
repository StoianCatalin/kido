import { Component, OnInit } from '@angular/core';
import {User} from "../../commons/models/user";
import {Marker} from "../../commons/models/marker";
import {AuthService} from "../../commons/services/auth/auth.service";
import {LocationService} from "../../commons/services/location/location.service";
import {ChildService} from "../services/child.service";
import * as io from 'socket.io-client';

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

  constructor(
    private childService: ChildService,
    private locationService: LocationService,
    private authService: AuthService
  ) { }

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
  }

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
    this.socket.emit('moveOnMap', {latitude: this.myMarker.latitude, longitude: this.myMarker.longitude});
  }

}
