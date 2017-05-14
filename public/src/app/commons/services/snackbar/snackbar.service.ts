import {Injectable, ElementRef} from '@angular/core';

@Injectable()
export class SnackbarService {

  snackbarComponent: any;

  constructor() {
    this.snackbarComponent = document.getElementsByTagName('km-snackbar');
  }

}
