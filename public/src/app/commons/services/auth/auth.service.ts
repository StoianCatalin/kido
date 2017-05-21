import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import * as io from 'socket.io-client';

@Injectable()
export class AuthService{

  private user: User;
  private authStatus : boolean = false;
  private token : string = null;
  private socket : any;

  constructor() {
    this.token = sessionStorage.token;
    if (this.token) {
      this.authStatus = true;
      if (sessionStorage.user)
        this.user = JSON.parse(sessionStorage.user);
      if (!this.socket) {
        this.socket = io.connect('http://localhost:4343', {
          'query': 'token=' + this.token
        });
        console.log('connected');
      }
    }
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  setToken(token) {
    this.token = token;
    sessionStorage.token = this.token;
    this.authStatus = true;
  }

  setUser(user: User) {
    this.user = user;
    if (this.user)
      sessionStorage.user = JSON.stringify(this.user);
  }

  getSocket(){
    if (!this.socket)
      this.socket = io.connect('http://localhost:4343', {
        'query': 'token=' + this.token
      });
    return this.socket;
  }

  logout() {
    this.token = null;
    this.user = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.authStatus = false;
    this.socket.disconnect();
    this.socket = '';
}

  isAuthentificated() {
    return this.authStatus;
  }

}
