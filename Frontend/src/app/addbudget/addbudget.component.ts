import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { response } from 'express';
import { Company } from '../Interfaces/company';
import { start } from 'repl';
import { Country } from '../Interfaces/country';
import { count } from 'console';
import { Currency } from '../Interfaces/currency';
import { State } from '../Interfaces/state';
import { City } from '../Interfaces/city';
import { BudgetDetail } from '../Interfaces/budgetdetail';
import { Observable, first, skip } from 'rxjs';
import { Budget } from '../Interfaces/budget';
import { AppComponent } from '../app.component';
import { formatDate } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';





@Component({
  selector: 'app-addbudget',
  templateUrl: './addbudget.component.html',
  styleUrl: './addbudget.component.css',
  providers: [MessageService]  
})
export class AddbudgetComponent implements OnInit {

single:any;
shows() {

}
  visible: boolean = false;
  badgeval:string = 'NEW';
  myForm!: FormGroup;
  myForm2!: FormGroup;
  currency:Currency[] = [];
  country:Country[] = [];
  state:State[] = [];
  city:City[] = [];
  citys:City[] = [];
  shortname: any[] = [];
  showwwww: boolean = false;
  budgetdetail: BudgetDetail[] = [];
  showval:number = 5;
  total_records: number = 0;
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  showAddBudgetdetail:boolean = false;
  budgetid :number =0;
  animation = false;
  showentrrytable:boolean = false;
  deletedetail:any = [];
  BudgetCreateDate!: string;
  isSubmitted: boolean = false;
 
  rowsperpageVal = this.appComponent.TableProp.rowsperpage;
  scrollheightval = this.appComponent.TableProp.smallTabScroll;

  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();

  
  products : any = [
    {
      startamount: '0',
      limit : '0',
      manhour : '1',
      containerType : "none",
      containerSize : '0'
    }
  ];

  containertype : any =[
  { label: 'General Purpose', value: 'General Purpose' },
  { label: 'Refrigerated', value: 'Refrigerated' },
  { label: 'OpenTop Container', value: 'OpenTop Container' },
  { label: 'Flatrack Container', value: 'Flatrack Container' },
  { label: 'HalfHeight Container', value: 'HalfHeight Container' },
  { label: 'Tunnel Container', value: 'Tunnel Container' },
  { label: 'Tanks Container', value: 'Tanks Container' }
  ]


  resetdetailentry(event : any){
    this.appComponent.msgStatus = 'confirm';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to reset budgetdetailline',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: 'Yes' ,
      accept: () => {
        this.myForm.get('startamount')?.setValue(0);
        this.myForm.get('limitamount')?.setValue(0);
        this.myForm.get('manhour')?.setValue(1);
        this.myForm.get('containersize')?.setValue(1);
        this.myForm.get('containertype')?.setValue('');
    
        this.detaillinerow = null;
        this.messageService.add({ severity: 'info', summary: 'Reset', detail: 'Detailline reset successfully.' });
      },
      reject : () =>{

      }
      
        
  });
 
  }

  reloadbudget(){
    this.budgetdetail
  }

  deleteline(event : any){
    
    this.appComponent.msgStatus = 'confirm';
    this.confirmationService.confirm({
      
      target: event.target as EventTarget,
      message: 'Are you sure to delete this detail line?',
      header: 'Confirmation',
      icon: 'pi pi-trash',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        let index: number;
          this.budgetdetail.forEach(element => {
            if(element.budgetdetailid == event.controls.budgetdetailid.value){
              this.deletedetail.push(element.budgetdetailid);
              this.budgetdetail.splice(index, 1);
              this.myForm.get('startamount')?.setValue(0);
              this.myForm.get('limitamount')?.setValue(0);
              this.myForm.get('manhour')?.setValue(1);
              this.myForm.get('containersize')?.setValue(1);
              this.myForm.get('containertype')?.setValue('');
              
            }
            index ++;
          });
          this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Detailline Deleted Successfully' });
         
        
        
      },
      reject : () =>{

      },
      
      
        
  });

  }




  Addintoentry(event : any){
    

    const containersize = this.myForm.get('containersize')?.value;
    const containertype = this.myForm.get('containertype')?.value;
    const manhour = this.myForm.get('manhour')?.value;
    const limitamount = this.myForm.get('limitamount')?.value;
    const startamount = this.myForm.get('startamount')?.value;
    const budgetid = this.myForm.get('budgetid')?.value;
    let budgetdetailid = 0;
    if(this.detaillinerow != null ){
      budgetdetailid = this.myForm.get('budgetdetailid')?.value;
    }
    

    
    const newItem: BudgetDetail = {
      budgetdetailid: budgetdetailid, 
      startamount: startamount,
      limitamount: limitamount,
      manhour: manhour,
      containersize: containersize,
      containertype: containertype,
      budgetid: budgetid,
      total_records: this.budgetdetail.length
  
    };



    
    if (budgetdetailid == 0 && this.detaillinerow == null) {
      const isDuplicate = this.budgetdetail.some(item => {
      return ((item.containertype === newItem.containertype  && item.startamount == newItem.startamount) || (item.containertype === newItem.containertype && item.limitamount == newItem.limitamount) || item.containertype == newItem.containertype); 
    });



if(newItem.containertype == null || newItem.startamount == 0 || newItem.limitamount == 0  || (newItem.startamount > newItem.limitamount)  || newItem.manhour == 0  || newItem.containersize == 0){
  this.appComponent.msgStatus = 'error';
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Please enter valid values in the fields to create a budget detailline.',
      header: 'Invalid Input',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: "none",
    rejectIcon: "none",
    rejectLabel: 'Close', 
    acceptVisible: false, 
    accept: () => {
    }
    
      
});



}else{
  if (!isDuplicate) {
    this.budgetdetail.push(newItem);
    this.appComponent.msgStatus = 'success';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detailline added Successfully',
      header: 'Confirmation',
      icon: 'pi pi-check-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: 'Ok', 
      rejectVisible: false, 
      accept: () => {
        
      }
  });
    this.myForm.get('startamount')?.setValue(0);
    this.myForm.get('limitamount')?.setValue(0);
    this.myForm.get('manhour')?.setValue(1);
    this.myForm.get('containersize')?.setValue(1);
    this.myForm.get('containertype')?.setValue('');
    } else {
      this.appComponent.msgStatus = 'warning';
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'This combination already exists. Please enter a new combination.',
        header: 'Duplicate Entry',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        acceptLabel: 'Ok', 
        rejectVisible: false, 
        accept: () => {
        }
    });
    }
}





    
  

      // this.budgetdetail.push(newItem);
      // console.log(this.budgetdetail);
      // console.log(newItem);
    } else {
     
      this.myForm.get('startamount')?.setValue(0);
      this.myForm.get('limitamount')?.setValue(0);
      this.myForm.get('manhour')?.setValue(1);
      this.myForm.get('containersize')?.setValue(1);
      this.myForm.get('containertype')?.setValue('');
        this.budgetdetail.splice(this.detaillinerow, 1, newItem);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Detailline Updated Successfully' });
      
    }
    

    this.detaillinerow = null;
    this.total_records = this.budgetdetail.length;



    
  }
  detaillinerow: any = null;
  showindetailtable(val: any,rowIndex : number) {
  this.detaillinerow = rowIndex;

    this.myForm.patchValue(val);

  }
  
  

  LazyDataBudget(event:any){
    this.ngxService.start();
    if(this.budgetid==0){
     this.ngxService.stop();

    }else{
      this.ngxService.start();
    const sortField: string | undefined = typeof event.sortField === 'string' ? event.sortField : undefined;
    const sortOrder: boolean = event.sortOrder === 1 ? true : false;
    const globalFilter : string | undefined = typeof event.globalFilter === 'string' ? event.globalFilter : undefined;
    let searchField: string[] = [];
    let sFiledValue: string[] = [];

    if (event.filters) {
      for (const key in event.filters) {
        if (event.filters.hasOwnProperty(key)) {
          const filterValue = event.filters[key];
          if (filterValue && ('value' in filterValue) && filterValue.value !== null) {
            if(key=="global"){
              continue;
            }
            searchField.push(key);
            sFiledValue.push(filterValue.value);
          }
        }
      }
    }
    this.searchField=searchField;
    this.sFiledValue=sFiledValue;
    this.sortOrder=sortOrder;
    this.sortField=sortField;
    this.globalFilter = globalFilter;
    
    this.showval = event.rows !== null ? event.rows : undefined;
   

    this.companyService.LazyDataBudgetDetail(event.first || 0, event.rows || 5, sortField, sortOrder, searchField, sFiledValue,globalFilter,this.budgetid)
    .subscribe((budget) => {
      if(budget[0]){
        console.log(budget[0].total_records);
        this.budgetdetail = budget;
        this.total_records = budget[0].total_records;
        this.ngxService.stop();
      }
      
    })
    

    
  }
  }
  


  constructor( private companyService: CompanyserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private appComponent:AppComponent,
    private ngxService : NgxUiLoaderService  
  ){

  }
  showDialog() {
    this.visible = true;
}


tree : any;


ngOnInit(): void {

  this.ngxService.start();


  this.companyService.getCountry().subscribe(countries => {
    this.companyService.getState().subscribe(states => {
      this.companyService.getCity().subscribe(cities => {
        const tree: TreeItem[] = [];

        countries.forEach(country => {
          const countryObj: TreeItem = {
            key: country.cid.toString(),
            label: country.country,
            data: 'Country Data Placeholder',
            children: []
          };

          const statesOfCountry = states.filter(state => state.cid === country.cid);

          statesOfCountry.forEach(state => {
            const stateObj: StateObj = {
              key: `${country.cid}-${state.sid}`,
              label: state.state,
              data: 'State Data Placeholder',
              children: []
            };

            const citiesOfState = cities.filter(city => city.cid === country.cid && city.sid === state.sid);

            citiesOfState.forEach(city => {
              const cityObj: TreeItem = {
                key: `${country.cid}-${state.sid}-${city.cityid}`,
                label: city.city,
                data: 'City Data Placeholder',
                children: []
              };

              this.companyService.getShortName().subscribe(shortnames => {
                shortnames.forEach(shortname => {
                  if (shortname.cid === country.cid && shortname.cityid === city.cityid) {
                    cityObj.children.push({
                      key: `${shortname.companyid}`, 
                      label: shortname.companyshortname,
                      data: 'Company Short Name Data Placeholder',
                      children: [] 
                    });
                  }
                });
              });

              stateObj.children.push(cityObj);
            });

            countryObj.children.push(stateObj);
          });

          tree.push(countryObj);
        });

        this.tree = tree;
      });
    });
  });
  this.initializeForm();
  this.loadCurrency();
  this.loadCountry();
  this.loadState();
  this.loadCity();
  this.loadCompany();

  if(this.id==0){
    this.showentrrytable = false;
    this.badgeval = 'NEW';  
  }else{
    this.showentrrytable = true;
    this.badgeval = 'EDIT';
    this.companyService.getById(this.id).subscribe(value => {
      console.log(value);
      console.log(value.establish_date);
      this.myForm.patchValue(value);
      
      this.BudgetCreateDate = formatDate(value.createdate,'dd-MMM-yyy','en-US').toUpperCase();
      this.budgetid = this.myForm.get('budgetid')?.value;
      if(this.myForm.get('budgetactive')?.value == 'true'){
        this.myForm.get('budgetactive')?.setValue(true);
      }else{
        this.myForm.get('budgetactive')?.setValue(false);
      }
      Object.keys(value).forEach(controlName => {
        if (this.myForm.get(controlName)) {
          const disableFields = [ 'budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
          if (!disableFields.includes(controlName) ) {
            this.myForm.get(controlName)?.disable();
          }
        }
      });
      this.addReadOnlyStyles();
      const event = {
        first : 0,
        rows: 5,
      }

      this.LazyDataBudget(event);
    })

  }
  
  
  interface StateObj {
    key: string;
    label: string;
    data: string;
    children: any[]; 
  }
  interface TreeItem {
    key: string;
    label: string;
    data: string;
    children: TreeItem[];
  }


  this.ngxService.stop();
  
 
}




addBudget( event : any){
 



  if(this.myForm.valid){
    let updatedetail:any = [];
    let insertdetail:any = [];
    
  
    this.budgetdetail.forEach((data:any) => {
        if(data.budgetdetailid != 0){
          updatedetail.push(data);
        }else{
          insertdetail.push(data);
        }
    })

    if(this.badgeval == 'NEW'){


      if(this.myForm.get('budgetcurrencyid')?.value == this.myForm.get('currencyid')?.value){
        const budgetActiveValue = this.myForm.get('budgetactive')?.value;
        const budgetActive = budgetActiveValue === null ? false : budgetActiveValue;
        const budget: Budget = {
          description: this.myForm.get('description')?.value,
          budgetcurrencyid: this.myForm.get('budgetcurrencyid')?.value,
          budgetactive: budgetActive.toString(),
          createdate: this.myForm.get('createdate')?.value,
          companyid: this.myForm.get('companyid')?.value,
          budgetid: 0,
          total_records: 0,
          currency: ''
        };
  
        
        
        this.companyService.insertBudget(budget).subscribe( val => {
       
          this.myForm.get('budgetid')?.setValue(val)
          insertdetail = [];
          this.budgetdetail.forEach((data:any) => {
              data.budgetid = val;
              insertdetail.push(data);
              if(insertdetail.length >0){
                this.companyService.insertBudgetLines(insertdetail).subscribe(value => {
                  this.appComponent.msgStatus = 'success';
                  this.confirmationService.confirm({
                    target: event.target as EventTarget,
                    message: 'Budget added Successfully',
                    header: 'Confirmation',
                    icon: 'pi pi-check-circle',
                    acceptIcon: "none",
                    rejectIcon: "none",
                    acceptLabel: 'Ok', 
                    rejectVisible: false, 
                    accept: () => {
                      
                    }
                });
                })
              }
            
        })
  
        this.badgeval = 'EDIT'
        insertdetail = [];
        this.isSubmitted = true;
        });
        
        
        
      }else{
        this.appComponent.msgStatus = 'warning';
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'The budget currency must match the company currency.',
          header: 'Currency Mismatch',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          rejectIcon: "none",
          acceptButtonStyleClass: 'p-button-warning',
          acceptLabel: 'Ok', 
          rejectVisible: false, 
          accept: () => {
          }
      });

      this.myForm.get('budgetcurrencyid')?.markAsTouched;
      this.myForm.get('budgetcurrencyid')?.setValue('');
      }

      

      
    }
  
    if(this.badgeval == 'EDIT'){
      
      const budgetActiveValue = this.myForm.get('budgetactive')?.value;
      const budgetActive = budgetActiveValue === null ? false : budgetActiveValue;
      const budget: Budget = {
        description: this.myForm.get('description')?.value,
        budgetcurrencyid: this.myForm.get('budgetcurrencyid')?.value,
        budgetactive: budgetActive.toString(),
        createdate: this.myForm.get('createdate')?.value,
        companyid: this.myForm.get('companyid')?.value,
        budgetid: this.myForm.get('budgetid')?.value,
        total_records: 0,
        currency: ''
      };

      if(this.myForm.get('description')?.touched || this.myForm.get('budgetcurrency')?.touched || this.myForm.get('budgetactive')?.touched){
        this.companyService.updateBudget(budget).subscribe(value => {
         
          console.log(value);
        })
       
        
      }
  
 
      if(updatedetail.length>0){
        this.companyService.updatebudgetlines(updatedetail).subscribe(value => {
          updatedetail = [];
          
          // console.log(value);
        })
      }
       
        
        if(insertdetail.length >0){
          this.companyService.insertBudgetLines(insertdetail).subscribe(value => {
            insertdetail = [];
            insertdetail = [];
            // console.log(value);
          })
        }
        

        if(this.deletedetail.length>0){
          this.companyService.deleteDetailLine(this.deletedetail).subscribe(value => {
            console.log(value);
          })

          this.deletedetail = [];
        }
        

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Budget Detail Updated Successfully !' });
        this.isSubmitted = true;
  
      
    }
  }else{
    this.appComponent.msgStatus = 'error';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please enter valid values in the fields to create a budget detail.',
      header: 'Invalid Input',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check",
      rejectIcon: "none",
      rejectLabel: 'Ok', 
      acceptVisible: false, 
      accept: () => {
      }
  });
  if (this.myForm.invalid) {
      this.myForm.get('budgetcurrencyid')?.setValue('');
        for (const control of Object.keys(this.myForm.controls)) {
          this.myForm.controls[control].markAsTouched();
        }
      }
  }
  
}

transformToUppercase(event:any){
  const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.myForm.get('description')?.setValue(input.value);
}

files: Country[] = [];

loadCurrency(){
  this.companyService.GetCurrency().subscribe(currency => {
      this.currency = currency;
     
  })
}
loadCountry(){
  this.companyService.getCountry().subscribe(country => {
    this.country = country;
  })
}
loadState(){
  this.companyService.getState().subscribe(state => {
    this.state = state;
  })
}
loadCity(){
  this.companyService.getCity().subscribe(city => {
    this.city = city;
  })
}

loadCompany(){
  this.companyService.getShortName().subscribe(shortname => {
    this.shortname = shortname;
  })
}
  
onNodeSelect(val : any){
  
if(val.node.children.length == 0){
  this.budgetid = this.myForm.get('budgetid')?.value;
  this.ngxService.start();
    this.companyService.getById(val.node.key).subscribe(company => {
      
      this.myForm.patchValue(company);
      this.budgetid = this.myForm.get('budgetid')?.value;
      Object.keys(company).forEach(controlName => {
        if (this.myForm.get(controlName)) {
          const disableFields = ['budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
          if (!disableFields.includes(controlName) ) {
            this.myForm.get(controlName)?.disable();
          }

        }
      });
      const event = {
        first : 0,
        rows: 5,
      }
  
      this.LazyDataBudget(event);
      
      this.showentrrytable = true;
      this.addReadOnlyStyles();
      this.ngxService.stop();
      if(this.myForm.get('budgetid')?.value != 0){
        this.badgeval = 'EDIT';
        this.myForm.get('budgetcurrencyid')?.disable();
      }else{
        this.badgeval = 'NEW';
        this.myForm.get('budgetcurrencyid')?.enable();
        this.budgetdetail = [];
      }
    })
}else{
  this.appComponent.msgStatus = 'warning';
  this.confirmationService.confirm({
    target: val.target as EventTarget,
    message: 'Choose Proper Company Short name in the Hierarchy',
    header: 'Choose Proper Company',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: "none",
    rejectIcon: "none",
    rejectLabel: 'Ok', 
    acceptVisible: false, 
    accept: () => {
    }
});
}


console.log(this.myForm.get('budgetcurrency')?.value);
}
addReadOnlyStyles(): void {
 
  const readOnlyFields = document.querySelectorAll('.readonly-field');
  readOnlyFields.forEach(field => {
    field.classList.add('read-only');
  });
}

onCountryChange(event: any) {
  const selectedCountryid: number[] = [];
  if (event) {
    selectedCountryid.push(event.value);
    this.getCitybyCountryIds(selectedCountryid);
    this.getStatesByIds(selectedCountryid);
  }
}

onStateChange(event: any) {
  const selectedStateid: number[] = [];
  if (event) {
    selectedStateid.push(event.value);
    this.getCityBystateIds(selectedStateid);
  }
}

onCityChange(event : any){
  let selectedCityid:number = 0;
  if(event){
    selectedCityid = event.value;
    this.companyService.getShortNameByid(selectedCityid).subscribe ( data => {
      this.shortname = [];
      data.forEach(element => {
        this.shortname.push(element);
      });
      
    })

  } 
}



onShortnameChange(event:any){
  this.companyService.getById(event.value).subscribe(company => {
      
    this.myForm.patchValue(company);
    this.budgetid = this.myForm.get('budgetid')?.value;
    Object.keys(company).forEach(controlName => {
      if (this.myForm.get(controlName)) {
        const disableFields = ['budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
        if (!disableFields.includes(controlName) ) {
          this.myForm.get(controlName)?.disable();
        }

      }
    });
    const event = {
      first : 0,
      rows: 5,
    }

    this.LazyDataBudget(event);
    
    this.showentrrytable = true;
    this.addReadOnlyStyles();
    this.ngxService.stop();
    if(this.myForm.get('budgetid')?.value != 0){
      this.badgeval = 'EDIT';
      this.myForm.get('budgetcurrencyid')?.disable();
    }else{
      this.badgeval = 'NEW';
      this.myForm.get('budgetcurrencyid')?.enable();
      this.budgetdetail = [];
    }
  })
}



getStatesByIds(selectedCountryIds: number[]): void {
  this.companyService.getStatesByIds(selectedCountryIds)
    .subscribe(states => {
      this.state = states;
    });
}

getCitybyCountryIds(selectedCountryIds: number[]): void {
  this.companyService.getCitybyCountryIds(selectedCountryIds)
    .subscribe(citys => {
      this.city = citys;
    });
}

getCityBystateIds(selectedCountryIds: number[]): void {
  this.companyService.getCityBystateIds(selectedCountryIds)
    .subscribe(citys => {
      this.citys = citys;
    });
}


 
GetLast($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetNext($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetPrevious($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetFirst($event: MouseEvent) {
throw new Error('Method not implemented.');
}
SubmitAndReset() {
throw new Error('Method not implemented.');
}
Addnew($event: MouseEvent) {
throw new Error('Method not implemented.');
}
routeToList() {
throw new Error('Method not implemented.');
}
showfil(){
  this.showwwww = !this.showwwww;
  
}
hidefil(){
  this.showwwww = false;

}
BackToList() {
  this.appComponent.msgStatus = 'confirm';
console.log(this.myForm);
  if (this.myForm.touched && !this.isSubmitted) {

    this.confirmationService.confirm({
      message: 'You have unsaved changes in the screen. Do you want to continue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.Flag.emit(false);
      },
      
    });
  } else {
    this.Flag.emit(false); 
  }
}





initializeForm(): void {
  this.myForm = this.formBuilder.group({
    budgetid: [''],
    description: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.pattern('[a-zA-Z0-9\\- ]*')
    ]],
    currency: ['',Validators.required],
    startamount: [, [
      Validators.pattern('^[0-9]*$'),
  ]],
  limitamount: [0, [
      Validators.pattern('^[0-9]*$'),

  ]],
    active: [''],
    createdate: [''],
    manhour: [1, [
      Validators.pattern('^[0-9]*$'),
      Validators.max(100)
  ]],
    containertype:[''],
    containersize: [1, [
      Validators.pattern('^[0-9]*$'),
      Validators.min(1),
      Validators.max(40),
  ]],
    companyid:['',Validators.required],
    companyname:['',Validators.required],
    companyshortname:['',Validators.required],
    contact:['',Validators.required],
    zipcode:['',Validators.required],
    country:[''],
    state : [''],
    city:[''],
    revenue:['',Validators.required],
    cid:['',[Validators.required]],
    sid:['',[Validators.required]],
    cityid:['',[Validators.required]],
    currencyid:['',Validators.required],
    budgetcurrencyid:['',Validators.required],
    budgetactive:['False'],
    budgetdetailid:[]




  } ,{ validators: startAmountLessThanLimitAmountValidator() });
}


DisableBudget(event : any){
  if(this.badgeval=='EDIT'){
    if(event.checked== false){
      this.myForm.get('budgetactive')?.setValue(true);
      this.appComponent.msgStatus = 'error';
      this.confirmationService.confirm({
        message: 'Deactivation is not possible Once created the Budget',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        acceptLabel:"ok",
        rejectVisible:false,
        accept: () => {
          
        },
        
      });
    }
  }
}

  
}
export function startAmountLessThanLimitAmountValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {

    const startAmount = formGroup.get('startamount')?.value;
    const limitAmount = formGroup.get('limitamount')?.value;
    const containerType = formGroup.get('containertype')?.value;

    if ( startAmount >= limitAmount && startAmount != '0'  && limitAmount !='0') {
        return { 'startAmountGreaterThanOrEqualLimitAmount': true };
    }
    return null;
  };


  
}