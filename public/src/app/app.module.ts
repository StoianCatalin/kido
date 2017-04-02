import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonsModule } from './commons/commons.module';
import { ParentModule } from './parent/parent.module';
import { ChildModule } from './child/child.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthService} from "./commons/services/auth/auth.service";
import {HttpClientService} from "./commons/services/http-client/http-client.service";
import {UserService} from "./commons/services/user/user.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonsModule,
    ParentModule,
    ChildModule
  ],
  providers: [
    AuthService,
    HttpClientService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
