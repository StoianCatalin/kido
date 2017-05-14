import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth/auth.service";
import {UserService} from "../../services/user/user.service";

@Injectable()
export class BasedOnTypeGuard implements CanActivate {
  user: User;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.user = this.authService.getUser();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user && this.user.type == 'child'){
      this.router.navigate(['/child']);
      return false;
    }
    else if (this.user && this.user.type == 'parent') {
      this.router.navigate(['/parent']);
      return false;
    }
    else
      return false;
  }
}
