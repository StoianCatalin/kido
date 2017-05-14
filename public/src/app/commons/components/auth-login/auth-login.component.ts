import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'km-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  public email : string;
  public password: string;
  public isError: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  submit() {
    this.userService.login(this.email, this.password).subscribe((response) => {
      this.userService.getMe().subscribe((user) => {
        this.userService.setUserOnAuth(user);
        this.router.navigate(['/home']);
      });
    }, () => {
      this.isError = true;
    });
  }

  hideMessage() {
    this.isError = false;
  }

}
