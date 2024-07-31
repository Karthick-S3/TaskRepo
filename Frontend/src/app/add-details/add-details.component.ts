import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { City } from '../Interfaces/city';
import { State } from '../Interfaces/state';
import { Country } from '../Interfaces/country';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Company } from '../Interfaces/company';
import { CompanydetailsComponent } from '../companydetails/companydetails.component';
import { Currency } from '../Interfaces/currency';
import { Filedetail } from '../Interfaces/filesdetail';
import { formatDate } from '@angular/common';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';








@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css'],
  providers: [MessageService]  
})
export class AddDetailsComponent implements OnInit {
  isActive: boolean = false;
  submit = false;
  myForm!: FormGroup;
  citys: City[] = [];
  states: State[] = [];
  countrys: Country[] = [];
  currency: Currency[] = [];
  animation: boolean = false;
  newcompany : Company[] = [];
  badgeval : string = '';
  visible:boolean = false;
  CompanyCreateDate!: string;
  isSubmitted :boolean = false;


  scrollheightVal = this.appcomponent.TableProp.smallTabScroll;


  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();
  types: any;

  
  
  

  constructor(
    private companyService: CompanyserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private companydetail:CompanydetailsComponent,
    private appcomponent: AppComponent,
    private ngxService : NgxUiLoaderService
    // private fileUploadService: FileUploadService
  ) {}
  GetFirst(event : any){
    this.ngxService.start();
    const val = this.companydetail.returnFirstCompId();
    if (val === undefined) {
      this.noRecordFoundError();
      return;
    }
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);
          
          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());

          if(response.active == "yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }

          this.ngxService.stop();
     }
     });
     this.loadAttachments(id);
  }
  GetLast(event : any){
    this.ngxService.start();
    const val = this.companydetail.returnLastCompId();
    if (val === undefined) {
      this.noRecordFoundError();
      return;
    }
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);
          
          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());
          this.myForm.get('zipcode')?.setValue(response.zipcode.toString());

          if(response.active == "yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
          this.loadAttachments(id);
          this.ngxService.stop();
     }
     });
     
  }

  GetPrevious(event : any){
    this.ngxService.start();
    const val = this.companydetail.returnPreviousCompId();
   
    if (val === undefined) {
      this.noRecordFoundError();
      return;
    }
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);
          
          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());

          if(response.active == "yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
          this.ngxService.stop();
     }
     });
     this.loadAttachments(id);
  }

  GetNext(event : any) {
    this.ngxService.start();
    const val = this.companydetail.returnNextCompId();
    if (val === undefined) {
      this.noRecordFoundError();
      return;
    }
    
    const id: number = val;
    
    this.companyService.getById(Number(id)).subscribe({
      next: (response) => {
        this.myForm.patchValue(response);
        this.myForm.get('email')?.setValue("Example@gmail.com");
        this.myForm.get('revenue')?.setValue(response.revenue.toString());
  
        if (response.active == "yes") {
          this.myForm.get('active')?.setValue(true);
        } else {
          this.myForm.get('active')?.setValue(false);
        }
        this.ngxService.stop();
      }
    });
    this.loadAttachments(id);
  }

  noRecordFoundError(){
    this.ngxService.stop();
    this.appcomponent.msgStatus = 'warning';
    this.confirmationService.confirm({
      message: 'No Records Found',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: 'Ok', 
      acceptVisible: false, 
      accept: () => {
      }
  });
  }
  

  routeToList(){
    if(this.myForm.invalid){
      this.insert();
    }else{
      this.insert();
      this.Flag.emit(false);
    }
  }
  resetForm() {
    this.messageService.add({ severity: 'info', summary: 'New Company', detail: 'To add a new detail, the form has been cleared.' });
    this.myForm.reset();
    this.ngOnInit();
    // setTimeout(() => {
    //   if (this.myForm.invalid) {
    //     for (const control of Object.keys(this.myForm.controls)) {
    //       this.myForm.controls[control].markAsUntouched();
    //     }
    //   }
    // });
  }
  SubmitAndReset(){
    this.ngxService.start();
    if(this.myForm.valid){
      this.insert();
      this.myForm.reset();
      this.badgeval = "NEW";
      this.id=0;
      this.initializeForm();
    }else{
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please enter a valid value.' 
      });
    }
    this.ngxService.stop();
    
    
  }
  onCountryChange(event: any) {
    this.ngxService.start();
    
    const selectedCountryid: number[] = [];
    if (event) {
      selectedCountryid.push(event.value);
      this.getCitybyCountryIds(selectedCountryid);
      this.getStatesByIds(selectedCountryid);
    }
    this.ngxService.stop();
  }

  onStateChange(event: any) {
    this.ngxService.start();
    const selectedStateid: number[] = [];
    if (event) {
      selectedStateid.push(event.value);
      this.getCityBystateIds(selectedStateid);
    }
    this.ngxService.stop();
  }

  Addnew(event: Event) {
    this.ngxService.start();
    this.id = 0;
    if(this.myForm.touched || this.id>0){
      this.appcomponent.msgStatus = 'confirm';
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'You have unsaved changes in the screen. Do you want to continue?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
          alert("working")
            this.resetForm();
            this.attlen = false;
            this.attachmentdata = [];
            this.attachavailable = false;
            this.attachmentlength = 0;
        },
        
    });
    }else{
      this.resetForm();
            this.attlen = false;
            this.attachmentdata = [];
            this.attachavailable = false;
            this.attachmentlength = 0;
      
    }
    this.ngxService.stop();
    
}

BackToList(event: Event) {
<<<<<<< HEAD
  if (this.myForm && this.myForm.touched) { // Check if myForm exists and if it's touched
=======
  if(this.myForm.touched && !this.isSubmitted){
    this.appcomponent.msgStatus = 'confirm';
>>>>>>> 790f8ceac33f0518ff07af9e093e04e08b8f14da
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'You have unsaved changes on the screen. Do you want to continue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
<<<<<<< HEAD
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
=======
      acceptIcon:"none",
      rejectIcon:"none",
  
>>>>>>> 790f8ceac33f0518ff07af9e093e04e08b8f14da
      accept: () => {
        this.Flag.emit(false);
      },
      reject: () => {
        
      }
    });
  } else {
    this.Flag.emit(false);
  }
}


  ngOnInit(): void {
    
    this.loadCountry();
    this.loadState();
    this.loadCity();
    this.loadCurrency();

    if(this.id == 0){
      this.ngxService.start();
      this.initializeForm();
      this.badgeval = 'NEW';
      this.ngxService.stop();
      
    }else{
      this.ngxService.start();
      this.badgeval = 'EDIT';
      this.initializeForm();
      this.companyService.getById(Number(this.id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);
          this.CompanyCreateDate =  formatDate(response.createdate,'dd-MMM-yyy','en-US').toUpperCase();
          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());
          // this.myForm.get('zipcode')?.setValue(response.zipcode.toString());
          
          if(response.active == "yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }

        }
        
        
      });
    
      this.loadAttachments(this.id);
      
      this.ngxService.stop();
    }

  }

  // filetype: string = '';
  // typeoffile = ['xls', 'xlsx', 'csv', 'doc', 'ods', 'docx', 'pdf', 'gif', 'txt', 'zip', 'msg', 'jfif'];

  loadAttachments(companyid: number) {
    this.ngxService.start();
    this.companyService.getFilesByID(companyid).subscribe(value => {
      if (value && value.length > 0) {
        this.attlen = true;
        this.attachmentdata = value.map(file => ({
          name: file.originalname,
          size: file.filesize,
          thumbnail: file.url
        }));
        this.attachavailable = true;
        this.attachmentlength = value.length;
      } else {
        this.attlen = false;
        this.attachmentdata = [];
        this.attachavailable = false;
        this.attachmentlength = 0;
        console.log('No files found for the company.');
      }
      this.ngxService.stop();
    });
  }
  
  // getFileType(originalname: string): string | undefined {
  //   const parts = originalname.split('.');
  //   if (parts.length > 1) {
  //     return parts.pop()?.toLowerCase(); 
  //   }
  //   return undefined;
  // }
  

getFileURL(type: string): string {
  switch (type) {
    case 'gif':
      return '../assets/filetype/gif.jpg';
    case 'txt':
      return '../assets/filetype/txt.jpg';
    case 'doc':
      return '../assets/filetype/doc.jpg';
    case 'pdf':
      return '../assets/filetype/pdf.jpg';
    case 'xls':
      return '../assets/filetype/xls.jpg';
    case 'zip':
      return '../assets/filetype/zip.jpg';
    default:
      return '../assets/default.jpg'; // Default URL for unknown file types
  }
}

  

  initializeForm(): void {
    this.myForm = this.formBuilder.group({
      companyname: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20),Validators.pattern('[a-zA-Z0-9\\-. ]*')]],
      companyshortname: ['',[Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9\\- ]*')]],
      contact: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      active: [''],
      cid: ['', Validators.required],
      sid: ['', Validators.required],
      cityid: ['', Validators.required],
      country:[''],
      state:[''],
      city:[''],
      contactid:[''],
      revenue: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'), Validators.maxLength(12)]],
      address: [''],
      email: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(250),Validators.email ]],
      zipcode: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      currency:[''],
      currencyid:['',Validators.required],
      containertype:[''],
      containersize:[''],
      description:[''],
      budgetactive:[''],
      dateval:[]
    });
  }

  loadCountry(): void {
    this.companyService.getCountry().subscribe({
      next: (countrys) => {
        this.countrys = countrys;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  loadState(): void {
    this.companyService.getState().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  loadCurrency():void {
    this.companyService.GetCurrency().subscribe({
      next: (currency) => {
        this.currency = currency;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  loadCity(): void {
    this.companyService.getCity().subscribe({
      next: (citys) => {
        this.citys = citys;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  insert(): void {
    this.ngxService.start();
    if(this.myForm.invalid){
      for (const control of Object.keys(this.myForm.controls)){
        this.myForm.controls[control].markAsTouched();
      }
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please enter a valid value.' 
      });
      this.ngxService.stop();
    }
    else{
      
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company details submitted successfully!' });
      this.myForm.get('active')?.setValue(this.myForm.value.active ? 'yes' : 'no');
      
      if(this.id > 0){
        this.myForm.get('description')?.setValue('');
        this.myForm.get('containertype')?.setValue('');
        this.myForm.get('containersize')?.setValue('');
        this.myForm.get('budgetactive')?.setValue('');
        this.companyService.updateCompany(this.myForm.value).subscribe({
         
          next : (company) => {
            this.appcomponent.msgStatus = 'success';
            this.confirmationService.confirm({
              message: 'Company Details Updated Successfully',
              header: 'Confirmation',
              icon: 'pi pi-check-circle',
              acceptIcon: "none",
              rejectIcon: "none",
              acceptLabel: 'Ok', 
              rejectVisible: false, 
              accept: () => {
                
              }
          });
            console.log("updated succesfully");
            if(this.attachmentdata.length>0){
              this.uploadFiles(this.formData);
            }
            
          },
          error: (response) => {
            console.log(response);
          }
        })
<<<<<<< HEAD
        if(this.attachmentdata.length > 0){
          this.uploadFiles(this.formData);
        }
        
=======
        this.isSubmitted = true;
        this.ngxService.stop();
>>>>>>> 790f8ceac33f0518ff07af9e093e04e08b8f14da
      }else{

        this.myForm.get('contactid')?.setValue(0);
        console.log(this.myForm.value);
          this.companyService.insertCompany(this.myForm.value).subscribe({
            next: (company) => {
              this.appcomponent.msgStatus = 'success';
              this.confirmationService.confirm({
                message: 'Company Created Successfully',
                header: 'Confirmation',
                icon: 'pi pi-check-circle',
                acceptIcon: "none",
                rejectIcon: "none",
                acceptLabel: 'Ok', 
                rejectVisible: false, 
                accept: () => {
                  
                }
            });
            this.badgeval = 'EDIT'
              console.log("Inserted successfully");
            },
            error: (response) => {
              console.log(response);
            },
          });
          this.uploadFiles(this.formData);
        }
        this.isSubmitted = true;
        this.ngxService.stop();
    }
    
    
  }



  getStatesByIds(selectedCountryIds: number[]): void {
    this.companyService.getStatesByIds(selectedCountryIds)
      .subscribe(states => {
        this.states = states;
      });
  }

  getCitybyCountryIds(selectedCountryIds: number[]): void {
    this.companyService.getCitybyCountryIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });
  }

  getCityBystateIds(selectedCountryIds: number[]): void {
    this.companyService.getCityBystateIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });
  }
   


  AttachmentPop(){
    this.visible = true;
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); 
  }
  
attachmentdata: any[] = [];
attachmentlength: number = this.attachmentdata.length;
attlen: boolean = false;
attachavailable: boolean = false;

download(product: any) {
  const url = product.url ? URL.createObjectURL(product.url) : product.thumbnail;
    const link = document.createElement('a');
    link.href = url;
    link.download = product.name;
    link.click();
    URL.revokeObjectURL(url)
}





openimg(product: any) {
    const url = product.file ? URL.createObjectURL(product.file) : product.thumbnail;
    window.open(url, '_blank');
}

deleteattachment(index: number) {
  this.appcomponent.msgStatus = 'confirm';
  this.confirmationService.confirm({
    message: 'Are you sure to delete the file? Click Yes to Confirm and No to ignore requested action.',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
 
    accept: () => {
      if(this.attachmentdata.length==1){
        this.attachavailable = false;
        this.attlen= false;
      }
      this.attachmentdata.splice(index, 1);
      this.attachmentlength = this.attachmentdata.length;
    },
    reject: () => {
        
    }
});
 
}
formData: FormData = new FormData();

formData: FormData = new FormData();

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
<<<<<<< HEAD
      // const formData = new FormData();
=======
>>>>>>> 790f8ceac33f0518ff07af9e093e04e08b8f14da
      const acceptedformat = ['jpg', 'png', 'jpeg', 'xls', 'xlsx', 'csv', 'doc', 'ods', 'docx', 'pdf', 'gif', 'txt', 'zip', 'msg', 'jfif'];
      let Flag = true;

      for (let i = 0; i < input.files.length; i++) {
          const file = input.files[i];
          if (file.name.length > 50) {
              this.showFileNameExceedsLimitWarning();
              input.value = '';
              Flag = false;
              continue;
          } else if (Math.round(file.size / 1048576) > 15) {
              input.value = '';
              Flag = false;
              this.showFileSizeExceedsLimitWarning();
              continue;
          } else if (file.type) {
              const fileExtension = file.name.split('.').pop()?.toLowerCase();
              if (fileExtension && !acceptedformat.includes(fileExtension)) {
                  this.showFileTypeExceedsLimitWarning();
                  Flag = false;
                  input.value = '';
                  continue;
              }
          }

          const reader = new FileReader();
          reader.onload = (e: any) => {
              this.attachmentdata.push({
                  file,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  thumbnail: e.target.result
              });
              this.attachmentlength++;
          };

          reader.readAsDataURL(file);
          this.formData.append('files', file);
      }

      if (Flag) {
<<<<<<< HEAD
          
=======
         
>>>>>>> 790f8ceac33f0518ff07af9e093e04e08b8f14da
          this.attlen = true;
          this.attachavailable = true;
          console.log(this.formData);
      }
  }
  
}

  
  uploadFiles(formData: FormData) {
    this.ngxService.start();
    this.companyService.uploadFiles(formData, this.id)
      .subscribe({
        next: (response: Filedetail ) => {
          console.log('Response:', response);
          if (response.message === 'Files uploaded successfully.') {
            console.log('Files uploaded successfully');
          } else {
            console.error('Unexpected response:', response);
          }
        },
        error: (error: any) => {
          console.error('Error uploading files:', error);
        }
      });
      this.ngxService.stop();
  }
  
  showFileNameExceedsLimitWarning() {
    this.appcomponent.msgStatus = 'error';
    this.confirmationService.confirm({
      message: 'File Name should be lesser than or equal to 50 characters.',
      header: 'Invalid File Name',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: 'Ok',
      acceptVisible: false,
      accept: () => {
        // Handle accept action if needed
      }
    });
  }

  showFileSizeExceedsLimitWarning() {
    this.appcomponent.msgStatus = 'error';
    this.confirmationService.confirm({
      message: 'File Size should be lesser than or equal to 15 MB.',
      header: 'Invalid File Size',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: 'Ok',
      acceptVisible: false,
      accept: () => {
        // Handle accept action if needed
      }
    });
  }
  
  showFileTypeExceedsLimitWarning() {
  
    this.appcomponent.msgStatus = 'error';
    this.confirmationService.confirm({
      message: 'Incorrect File Format. Please upload the files with recommended formats.',
      header: 'Invalid File Format',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: 'Ok',
      acceptVisible: false,

      accept: () => {
      
      }
    });
  }
  
 
  alertdate(event : any){
    console.log(event)
  }

  newDate() {
    // Set the date to 28 Mar 2023
    const newDate = new Date(2023, 2, 28); // Month is 0-based, so 2 is March
    this.myForm.get('dateval')?.setValue(newDate);
  }
  


}


