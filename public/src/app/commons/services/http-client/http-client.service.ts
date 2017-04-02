import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class HttpClientService {

  constructor(private http: Http, private authService: AuthService) { }

  createAuthorizationHeader(headers: Headers) {
    const token = this.authService.getToken();
    if (token)
      headers.append('Authorization', 'JWT ' + token);
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

}
