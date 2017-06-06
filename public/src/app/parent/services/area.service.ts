import { Injectable } from '@angular/core';
import {HttpClientService} from "../../commons/services/http-client/http-client.service";

@Injectable()
export class AreaService {

  createPolygonAreaURL : string = '/api/areas/create/polygon';
  getPolygonAreasURL : string = '/api/areas/polygon';
  deleteAreaURL : string = '/api/areas/polygon';
  createCircleAreaURL : string = '/api/areas/create/circle';

  constructor(private http: HttpClientService) { }

  createPolygonArea(polygon) {
    return this.http.post(this.createPolygonAreaURL, polygon)
      .map(response => response.json());
  }

  getPolygonAreas() {
    return this.http.get(this.getPolygonAreasURL)
      .map(response => response.json());
  }

  removeArea(id : number) {
    return this.http.delete(this.deleteAreaURL, {id: id});
  }

  createCircleArea(circle) {
    return this.http.post(this.createCircleAreaURL, circle)
      .map(response => response.json());
  }
}
