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
    AuthRegisterComponent
  ],
  exports: [
    SlidebarComponent,
    FooterComponent,
    NavbarComponent
  ],
  providers: []
})
export class CommonsModule { }
