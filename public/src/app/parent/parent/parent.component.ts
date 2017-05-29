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
  childs: User[];
  historyPoints : any[] = [];

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
        this.childs = childs;
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
      let user = this.childs.find((child) => {
        return child.id == coordinates.id;
      });
      user.locations.unshift(coordinates);
    });
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

  focusOnChild(child) {
    let locations = this.markers.find((item) => {
      return item.id == child.id;
    });
    this.lat = locations.latitude;
    this.lng = locations.longitude;
  }

  showHistory(child) {
    if (this.historyPoints == child.locations)
      this.historyPoints = [];
    else
      this.historyPoints = child.locations;
  }

  deleteUser(child) {
    this.parentService.deleteChild(child)
      .subscribe(response => {
        let index = this.markers.findIndex((item) => {
          return item.id = child.id;
        });
        this.markers.slice(index, 1);
        index = this.childs.findIndex((item) => {
          return item.id = child.id;
        });
        this.childs.slice(index, 1);
      });
  }

}
