import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component {
  constructor(private ngxService:NgxUiLoaderService){}
  @Input() childForm!: FormGroup;

  ngOnInit(): void {
    this.ngxService.start();
    this.ngxService.stop();
  }

}
