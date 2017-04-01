import {Component, OnInit, ElementRef} from '@angular/core';

declare const $ : any;

@Component({
  selector: 'km-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.scss']
})
export class SlidebarComponent implements OnInit {

  constructor(private elementRef : ElementRef) { }

  ngOnInit() {
  }

  selfToggle() {
    $(this.elementRef.nativeElement).sidebar('setting', 'transition', 'scale down').sidebar('toggle');
  }

}
