// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CompanyserviceService } from '../companyservice.service';
// import { TestData } from '../Interfaces/testData';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {

//   mainForm!: FormGroup;
//   mainForm2!: FormGroup;
//   childform1!:FormGroup;
//   childform2!:FormGroup;
 
//   constructor(private formBuilder: FormBuilder,private companyService: CompanyserviceService) {}

//   ngOnInit(): void {
//     this.initializeForms();
//   }

//   initializeForms() {
//     this.mainForm = this.formBuilder.group({
//       FirstName: [''],
//       LastName:[''],
//       phoneNumber: [0]
//     });

//     this.childform1= this.formBuilder.group({
//       FirstName: ['',require],
//       LastName :['',require]
//     })

    
//     this.childform2= this.formBuilder.group({
//       lastName: [''],
//     })


//     this.mainForm2 = this.formBuilder.group({
//       childform1: this.childform1,
//       childform2: this.childform2

//     })

   
//   }

//   submitForm() {

//     console.log(this.mainForm2.value);
  
//       const testData: TestData = {
//         Test1: this.mainForm2.get('childform1')?.value,
//         Test2: this.mainForm2.get('childform2')?.value
//       };
  
//       this.companyService.insertTest(testData).subscribe(
//         response => {
//           console.log('Data submitted successfully', response);
//         },
//         error => {
//           console.error('Error submitting data', error);
//         }
//       );
   
//   }
  
  


//   badgeval = "Edit";
//   currentStep: number = 1;  // Initial step

//   steps = [
//     { id: 1, label: 'RC Detail' },
//     { id: 2, label: 'Rates & Taxes' },
//     { id: 3, label: 'Relevant Pools' },
//     { id: 4, label: 'Limit & Spare Parts' },
//     { id: 5, label: 'Notification' }
//   ];
// attlen: any;
// attachmentlength: any;

//   OpenDiv(num: number) {
//     this.currentStep = num;
//   }

//   BackToList($event: MouseEvent) {
//     // Implementation here
//   }
//   Addnew($event: MouseEvent) {
//     // Implementation here
//   }
//   routeToList() {
//     // Implementation here
//   }
//   SubmitAndReset() {
//     // Implementation here
//   }
//   AttachmentPop() {
//     // Implementation here
//   }
//   GetFirst($event: MouseEvent) {
//     // Implementation here
//   }
//   GetPrevious($event: MouseEvent) {
//     // Implementation here
//   }
//   GetNext($event: MouseEvent) {
//     // Implementation here
//   }
//   GetLast($event: MouseEvent) {
//     // Implementation here
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyserviceService } from '../companyservice.service';
import { TestData } from '../Interfaces/testData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mainForm!: FormGroup;
  mainForm2!: FormGroup;
  childform1!: FormGroup;
  childform2!: FormGroup;

  constructor(private formBuilder: FormBuilder, private companyService: CompanyserviceService) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms() {
    this.childform1 = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    });
  
    this.childform2 = this.formBuilder.group({
      phoneNumber: [''],
    });
  
    this.mainForm2 = this.formBuilder.group({
      childform1: this.childform1,
      childform2: this.childform2
    });
  }
  

  submitForm() {

      const testData: TestData = {
        Test1: this.mainForm2.get('childform1')?.value,
        Test2: this.mainForm2.get('childform2')?.value
      };

      this.companyService.insertTest(testData).subscribe(
        response => {
          console.log('Data submitted successfully', response);
        },
        error => {
          console.error('Error submitting data', error);
        }
      );
    
  }

  badgeval = "Edit";
  currentStep: number = 1; 

  steps = [
    { id: 1, label: 'RC Detail' },
    { id: 2, label: 'Rates & Taxes' },
    { id: 3, label: 'Relevant Pools' },
    { id: 4, label: 'Limit & Spare Parts' },
    { id: 5, label: 'Notification' }
  ];

  OpenDiv(num: number) {
    if (num === 2 && !this.childform1.valid) {
      console.log('Child form 1 is not valid. Please complete it first.');
      return;
    }
    this.currentStep = num;
  }

  BackToList($event: MouseEvent) {
    // Implementation here
  }
  Addnew($event: MouseEvent) {
    // Implementation here
  }
  routeToList() {
    // Implementation here
  }
  SubmitAndReset() {
    // Implementation here
  }
  AttachmentPop() {
    // Implementation here
  }
  GetFirst($event: MouseEvent) {
    // Implementation here
  }
  GetPrevious($event: MouseEvent) {
    // Implementation here
  }
  GetNext($event: MouseEvent) {
    // Implementation here
  }
  GetLast($event: MouseEvent) {
    // Implementation here
  }
}
