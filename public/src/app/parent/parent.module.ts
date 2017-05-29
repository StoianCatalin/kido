import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './parent/parent.component';
import { RouterModule } from '@angular/router';
import {ParentService} from "./services/parent.service";

import { AgmCoreModule } from '@agm/core';
import { AreasComponent } from './areas/areas.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxMNUGrlup-y1XGWiYizEGsSGF9_RXEt0'
    })
  ],
  declarations: [ParentComponent, AreasComponent],
  exports: [ParentComponent],
  providers: [ParentService]
})
export class ParentModule { }
