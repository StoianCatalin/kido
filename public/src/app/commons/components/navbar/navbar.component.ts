import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'km-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() slidebar;

  constructor() { }

  ngOnInit() {
  }

  toogleSlidebar() {
    this.slidebar.selfToggle();
  }

}
