import { Component, OnInit,NgZone, HostListener  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  currentDate: Date | undefined;
  isFullScreen = false;

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullScreen = document.fullscreenElement !== null;
  }


  constructor(private ngZone: NgZone) {}

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

