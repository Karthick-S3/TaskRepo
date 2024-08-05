import { Component, OnInit, NgZone } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {
  msgStatus: string = '';
  isLogin!: boolean;
  isInitialized: boolean = false; 

  TableProp = {
    'rowsperpage': [5, 10, 25, 50],
    'smallTabScroll': '220px',
    'mediumTabScroll': '440px',
    'largeTabScroll': '640px'
  };

  constructor(private ngZone: NgZone, private messageService: MessageService, private router: Router, private ngxService : NgxUiLoaderService ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.checkToken();
  }
 

  checkToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      this.isLogin = !token;
      this.isInitialized = true;  
      if (token) {
        this.router.navigateByUrl('/companylist');
      } else {
        this.router.navigateByUrl('/login');
      }
    } else {
      console.warn('localStorage is not available');
    }

    this.ngxService.stop();
  }

  hide(val: boolean): void {
    this.isLogin = val;
    this.router.navigateByUrl('/companylist');
  }

  show(val: boolean): void {
    this.router.navigate(['/login']);
    this.isLogin = val;
  }
}
