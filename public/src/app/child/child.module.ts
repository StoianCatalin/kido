import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildComponent } from './child/child.component';
import { RouterModule } from '@angular/router';
import {CommonsModule} from "../commons/commons.module";
import {AgmCoreModule} from "@agm/core";
import {ChildService} from "./services/child.service";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxMNUGrlup-y1XGWiYizEGsSGF9_RXEt0'
    })

  ],
  declarations: [ChildComponent],
  exports: [ChildComponent],
  providers: [ChildService]
})
export class ChildModule { }
