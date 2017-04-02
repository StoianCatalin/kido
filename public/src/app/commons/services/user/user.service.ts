import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {HttpClientService} from "../http-client/http-client.service";
import 'rxjs/Rx';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UserService {

  private registerURL : string = '/api/auth/register';
  private getMeURL : string = '/api/users/me';

  constructor(private httpClient: HttpClientService, private authService: AuthService) {}

  getMe() {
    return this.httpClient.get(this.getMeURL)
      .map(response => response.json())
  }

  register(user : User) {
    return this.httpClient.post(this.registerURL, user)
      .map((response) => response.json())
      .map((response) => {
        if (response.token) {
          this.authService.setToken(response.token);
          this.getMe().subscribe((response) => {
            this.authService.setUser(response);
          }, (err) => {
            console.log(err.statusText);
          });
        }
        return response;
      })
  }
}
