import { Component, OnInit,NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  currentDate: Date | undefined;


  constructor(private ngZone: NgZone) {}

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
}
