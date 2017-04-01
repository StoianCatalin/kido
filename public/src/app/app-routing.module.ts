import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseTypeComponent } from './commons/components/choose-type/choose-type.component';
import {AuthLoginComponent} from "./commons/components/auth-login/auth-login.component";
import {AuthRegisterComponent} from "./commons/components/auth-register/auth-register.component";
import {ChildComponent} from "./child/child/child.component";
import {ParentComponent} from "./parent/parent/parent.component";
import {AuthGuard} from "./commons/guards/auth.guard";

const routes: Routes = [
  { path: '', component: ChooseTypeComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'register', component: AuthRegisterComponent },
  { path: 'child', component: ChildComponent, canActivate: [AuthGuard] },
  { path: 'parent', component: ParentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
