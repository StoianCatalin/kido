import {Component, OnInit, ViewChild} from '@angular/core';
import {ParentService} from "../services/parent.service";
import {LocationService} from "../../commons/services/location/location.service";
import {Marker} from "../../commons/models/marker";
import {AuthService} from "../../commons/services/auth/auth.service";
import {User} from "../../commons/models/user";

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

  constructor(
    private parentService: ParentService,
    private locationService: LocationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.me = this.authService.getUser();
    this.locationService.myCurrentLocation()
      .subscribe((point) => {
        this.lat = point.latitude;
        this.lng = point.longitude;
        this.markers.push(new Marker(this.me.id, this.me.nume + ' ' + this.me.prenume, this.me.type, point.latitude, point.longitude));
      });
    this.parentService.getMyChilds()
      .subscribe((childs) => {
        childs.forEach((child) => {
          this.markers.push(new Marker(child.id, child.nume + ' ' + child.prenume, child.type, child.locations[0].latitude, child.locations[0].longitude));
        });
      });
    this.socket = this.authService.getSocket();

    this.socket.on('moveOnMap', (coordinates) => {
      let marker = this.markers.find((mark) => {
        return mark.id == coordinates.id;
      });
      marker.longitude = coordinates.longitude;
      marker.latitude = coordinates.latitude;
    });
  }


}
