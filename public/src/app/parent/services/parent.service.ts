import {Injectable, OnInit} from '@angular/core';
import {HttpClientService} from "../../commons/services/http-client/http-client.service";

@Injectable()
export class ParentService{

  private getParentRoomNameUrl: string = '/api/users/parentroomname';
  private getChildsList: string = '/api/users/mychilds';
  socket: any;

  constructor(
    private http: HttpClientService
  ) { }

  getMyChilds() {
    return this.http.get(this.getChildsList)
      .map(response => response.json())
  }
}
