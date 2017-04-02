import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../../services/auth/auth.service";

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router : Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthentificated()) {
      return true;
    }
    else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
