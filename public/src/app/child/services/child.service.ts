import { Injectable } from '@angular/core';
import {HttpClientService} from "../../commons/services/http-client/http-client.service";

@Injectable()
export class ChildService {

  private getMyParentURL: string = '/api/users/myparent';

  constructor(
    private http: HttpClientService
  ) { }

  getMyParent() {
    return this.http.get(this.getMyParentURL)
      .map(response => response.json());
  }

}
