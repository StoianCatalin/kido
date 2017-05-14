import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client/http-client.service";

@Injectable()
export class LocationService {

  private getMyCurrentLocationURL: string = '/api/location/mylocation';

  constructor(private http: HttpClientService) { }

  myCurrentLocation() {
    return this.http.get(this.getMyCurrentLocationURL)
      .map(response => response.json())
  }

}
