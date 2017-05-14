import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChooseTypeComponent } from './components/choose-type/choose-type.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { RouterModule } from '@angular/router';
import { CustomFormsModule } from 'ng2-validation'
import { FormsModule } from '@angular/forms';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import {SnackbarService} from "./services/snackbar/snackbar.service";
import {LocationService} from "./services/location/location.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CustomFormsModule,
    FormsModule
  ],
  declarations: [
    SlidebarComponent,
    FooterComponent,
    NavbarComponent,
    ChooseTypeComponent,
    AuthLoginComponent,
    AuthRegisterComponent,
    SnackbarComponent
  ],
  exports: [
    SlidebarComponent,
    FooterComponent,
    NavbarComponent,
    SnackbarComponent
  ],
  providers: [
    SnackbarService,
    LocationService
  ]
})
export class CommonsModule { }
