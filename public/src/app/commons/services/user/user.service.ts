import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {HttpClientService} from "../http-client/http-client.service";
import 'rxjs/Rx';
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";

@Injectable()
export class UserService {

  private registerURL : string = '/api/auth/register';
  private loginURL : string = '/api/auth/login';
  private getMeURL : string = '/api/users/me';
  private checkReferenceURL : string = '/api/users/ifparentexist';

  constructor(private httpClient: HttpClientService, private authService: AuthService) {}

  /*
   @brief Returneaza informatiile despre utilizatorul curent.
   @how
   */
  getMe() {
    return this.httpClient.get(this.getMeURL)
      .map(response => response.json())
  }

  register(user : User) {
    return this.httpClient.post(this.registerURL, user)
      .map((response) => response.json())
      .map((response) => {
        if (response.token) {
          this.setAuthToken(response);
        }
        return response;
      })
  }

  login(email: string, password: string) : Observable<any> {
    return this.httpClient.post(this.loginURL, {email, password})
      .map(response => response.json())
      .map(response => {
        if (response.token) {
          this.setAuthToken(response);
        }
        return response;
      });
  }

  public checkIfReferenceExist(reference) {
    return this.httpClient.get(`${this.checkReferenceURL}/${reference}`)
      .map(response => response.json());
  }

  private setAuthToken(response) {
    this.authService.setToken(response.token);
  }

  setUserOnAuth(user) {
    this.authService.setUser(user);
  }

  refreshUserInfo() {
    this.getMe().subscribe((response) => {
      this.authService.setUser(response);
    });
  }
}
