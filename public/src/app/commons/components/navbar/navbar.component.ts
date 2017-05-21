import {Component, OnInit, Input} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'km-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() slidebar;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  toogleSlidebar() {
    this.slidebar.selfToggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
