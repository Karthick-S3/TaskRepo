import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.css'
})
export class Test1Component implements OnInit {
  constructor(private ngxService:NgxUiLoaderService){}
  @Input() childForm!: FormGroup;

  ngOnInit(): void {
    this.ngxService.start();
    this.ngxService.stop();
  }

}
