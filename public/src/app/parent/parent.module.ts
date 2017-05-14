import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './parent/parent.component';
import { RouterModule } from '@angular/router';
import {ParentService} from "./services/parent.service";

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxMNUGrlup-y1XGWiYizEGsSGF9_RXEt0'
    })
  ],
  declarations: [ParentComponent],
  exports: [ParentComponent],
  providers: [ParentService]
})
export class ParentModule { }
