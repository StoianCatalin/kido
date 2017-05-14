import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../../services/auth/auth.service";

@Injectable()
export class AllowParentGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user = this.authService.getUser();
    if (user.type == 'parent')
      return true;
    else {
      this.router.navigate(['/child']);
      return false;
    }
  }
}
