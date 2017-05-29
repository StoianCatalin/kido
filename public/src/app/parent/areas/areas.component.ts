import {Component, OnInit, ViewChild} from '@angular/core';
import {Marker} from "../../commons/models/marker";
import {LocationService} from "../../commons/services/location/location.service";
import {AuthService} from "../../commons/services/auth/auth.service";
import {User} from "../../commons/models/user";
import {AgmPolygon} from "@agm/core";

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

  constructor(private locationService: LocationService,
              private authService: AuthService) { }

  ngOnInit() {
    this.me = this.authService.getUser();
    this.locationService.myCurrentLocation()
      .subscribe((point) => {
        this.lat = point.latitude;
        this.lng = point.longitude;
        this.markers.push(new Marker(this.me.id, this.me.nume + ' ' + this.me.prenume, this.me.type, point.latitude, point.longitude));
      });

  }

}
