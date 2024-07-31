import { Component, OnInit,Output, EventEmitter, ViewChild, ElementRef  } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CompanyserviceService } from '../companyservice.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

@Output() Flag = new EventEmitter<boolean>();
@ViewChild('password') passwordInput!:ElementRef<HTMLInputElement>;
value: any;
myForm!: FormGroup;
animation:boolean = false;



ngOnInit(): void {
  this.initializeForm();
}

constructor(private formBuilder: FormBuilder,private companyservice:CompanyserviceService,private ngxService : NgxUiLoaderService){

}

incorrect: boolean = false;

SubmitForm(){
  this.ngxService.start();
  this.companyservice.UserLogin(this.myForm.value.username, this.myForm.value.password).subscribe(
    response => {
      console.log('Login successful', response);
      localStorage.setItem('token', response.token);
      this.Flag.emit(false);
      
  this.ngxService.start();
    },
    error => {
      this.incorrect = true;
      console.error('Login failed', error);
      this.ngxService.start();
    }
  );
}



initializeForm(): void {
  this.myForm = this.formBuilder.group({
    username : [''],
    password : ['']
  });
}
eye:boolean = true;
eyeChange(){
 
  if(this.eye){
    this.passwordInput.nativeElement.type = "text";
    this.eye = false;
  }else{
    this.passwordInput.nativeElement.type = "password";
    this.eye = true;
  }
  
}


}
