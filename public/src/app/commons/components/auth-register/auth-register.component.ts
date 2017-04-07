import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";

declare const $ : any;

@Component({
  selector: 'km-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})


export class AuthRegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('registerForm') registerForm;
  @ViewChild('type') type;

  user: User = new User();

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.ui.dropdown').dropdown();
  }

  onChangeType(data) {
    this.user.type = data;
  }

  submit() {
    if (this.registerForm.valid) {
      this.userService.register(this.user)
        .subscribe(() => {
          this.user = new User();
          this.router.navigate(['/home']);
        });
    }
  }

}
