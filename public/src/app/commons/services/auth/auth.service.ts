import { Injectable } from '@angular/core';
import {User} from "../../models/user";

@Injectable()
export class AuthService{

  private user: User;
  private authStatus : boolean = false;
  private token : string = null;

  constructor() {
    this.token = localStorage.token;
    if (this.token) {
      this.authStatus = true;
      this.user = localStorage.user;
    }
  }

  getToken() {
    return this.token;
  }

  getUser() {
    console.log(this.user);
    return this.user;
  }

  setToken(token) {
    this.token = token;
    localStorage.token = this.token;
    this.authStatus = true;
  }

  setUser(user: User) {
    this.user = user;
    localStorage.user = this.user;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authStatus = false;
}

  isAuthentificated() {
    return this.authStatus;
  }

}
