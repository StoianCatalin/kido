import {Injectable, OnInit} from '@angular/core';
import {HttpClientService} from "../../commons/services/http-client/http-client.service";

@Injectable()
export class ParentService{

  private getParentRoomNameUrl: string = '/api/users/parentroomname';
  private getChildsListURL: string = '/api/users/mychilds';
  private deleteChildURL: string = '/api/users/delete';
  socket: any;

  constructor(
    private http: HttpClientService
  ) { }

  getMyChilds() {
    return this.http.get(this.getChildsListURL)
      .map(response => response.json())
  }

  deleteChild(child) {
    return this.http.delete(this.deleteChildURL, {id: child.id})
      .map(response => response.json());
  }

}
