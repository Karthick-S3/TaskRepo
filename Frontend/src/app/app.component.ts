import { Component, OnInit,NgZone, HostListener  } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService,ConfirmationService]  

})
export class AppComponent implements OnInit {
  [x: string]: any;

  currentDate: Date | undefined;
  isFullScreen = false;

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullScreen = document.fullscreenElement !== null;
  }


  constructor(private ngZone: NgZone,private messageService: MessageService) {}

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
    alert("Logout")
  }


}

