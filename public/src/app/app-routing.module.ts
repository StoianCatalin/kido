import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseTypeComponent } from './commons/components/choose-type/choose-type.component';
import {AuthLoginComponent} from "./commons/components/auth-login/auth-login.component";
import {AuthRegisterComponent} from "./commons/components/auth-register/auth-register.component";
import {ChildComponent} from "./child/child/child.component";
import {ParentComponent} from "./parent/parent/parent.component";
import {AuthGuard} from "./commons/guards/auth/auth.guard";
import {BasedOnTypeGuard} from "./commons/guards/based-on-type/based-on-type.guard";
import {NotAuthGuard} from "./commons/guards/not-auth/not-auth.guard";
import {AllowParentGuard} from "./commons/guards/allow-parent/allow-parent.guard";
import {AllowChildGuard} from "./commons/guards/allow-child/allow-child.guard";

const routes: Routes = [
  { path: '', component: ChooseTypeComponent, canActivate: [NotAuthGuard] },
  { path: 'login', component: AuthLoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: AuthRegisterComponent, canActivate: [NotAuthGuard] },
  { path: 'home', component: ParentComponent, canActivate: [AuthGuard, BasedOnTypeGuard] },
  { path: 'child', component: ChildComponent, canActivate: [AuthGuard, AllowChildGuard ] },
  { path: 'parent', component: ParentComponent, canActivate: [AuthGuard, AllowParentGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    BasedOnTypeGuard,
    NotAuthGuard,
    AllowParentGuard,
    AllowChildGuard
  ]
})
export class AppRoutingModule { }
