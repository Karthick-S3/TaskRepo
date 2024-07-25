import { Component, OnInit,NgZone, HostListener, Output, EventEmitter  } from '@angular/core';

import { TableRadioButton } from 'primeng/table';

import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',

})
export class LayoutComponent implements OnInit {
  [x: string]: any;
  msgStatus: string = '';

  currentDate: Date | undefined;
  isFullScreen = false;


  @Output() Flag = new EventEmitter<boolean>();
  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullScreen = document.fullscreenElement !== null;
  }


  constructor(private ngZone: NgZone,private router : Router) {}

  FullScreen(){
    if (!this.isFullScreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } 
    }
  }

  ngOnInit() {
    this.updateDate();
  }

  updateDate() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.currentDate = new Date();
        });
      }, 1000);
    });
  }

  logout(){

    this.Flag.emit(true);
    localStorage.removeItem('token');
  }
 
  
}
