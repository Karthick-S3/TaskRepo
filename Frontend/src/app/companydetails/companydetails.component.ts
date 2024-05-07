
import { ChangeDetectorRef, Component, OnInit, ViewChild , ElementRef  } from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Company } from '../Interfaces/company';
import { Country } from '../Interfaces/country';
import { State } from '../Interfaces/state';
import { City } from '../Interfaces/city';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css'],
  providers: [MessageService]
})
export class CompanydetailsComponent implements OnInit {

  
  @ViewChild('demo') demoTable!: Table;
  @ViewChild('filterInput') filterInput!:ElementRef<HTMLInputElement>;
  

  total_record: number = 0;
  companys: Company[] = [];
  countrys: Country[] = [];
  selectedCountry: Country[] = [];
  selectedCountryIds: number[] = [];
  states: State[] = [];
  selectedState: State[] = [];
  citys: City[] = [];
  selectedCity: City[] = [];
  selectedStateIds: number[] = [];
  selectedCityIds: number[] = [];
  loading: boolean = false;
  animation: boolean = false;
  showwwww: boolean = false;
  fileName="Company Details.xlsx";
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  Companyid:any;
  Showadd:boolean = false;
  rowIndex:number = 0;
  showval: number | undefined;
  Tempcompany:Company[] = [];
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  



  

 

  routebyid(company:any,rowIndex:number){
    this.Companyid = company.companyid
    this.rowIndex = rowIndex;
    this.Showadd = true;

    this.companyService.lazyData2(0 || 0, this.total_record || 10, this.sortField, this.sortOrder, this.searchField, this.sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds, this.globalFilter)
    .subscribe(companies => {
      this.Tempcompany = companies;
    });
    
  }
  returnPreviousCompId(){
    if(this.rowIndex==0){
      return undefined;
    }else{
      return this.Tempcompany[--this.rowIndex].companyid;
    }
    
  }
   
  returnNextCompId() {
    if(this.rowIndex==this.Tempcompany.length-1){
      return undefined;
    }else{
      return this.Tempcompany[++this.rowIndex]?.companyid;
    }
  }
  
  
  returnLastCompId(){
    if(this.rowIndex== this.Tempcompany.length-1){
      return undefined;
    }else{
      this.rowIndex = this.Tempcompany.length-1;
      return this.Tempcompany[this.rowIndex].companyid;
    }
    
  }
  returnFirstCompId(){
    if(this.rowIndex==0){
      return undefined;
    }else{
      this.rowIndex = 0;
      return this.Tempcompany[0].companyid;
    }
    
  }
  shows(){
    this.Showadd = true;
    this.Companyid = 0;
  }

  show(val : boolean){
    this.Showadd = val;
  }
  

  ExportData() {
    const event = {
        first: 0,
        rows: this.total_record,
        sortField: "companyid",
        sortOrder: true
    };

    this.companyService.lazyData2(event.first || 0, event.rows || 10, event.sortField, event.sortOrder, this.searchField, this.sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds,this.globalFilter)
        .subscribe(companies => {
            if (companies && companies.length > 0) {
                const jsonData = companies.map(company => {
                    return {
                      'Cmp Id': company.companyid,
                      'CompanyName': company.companyname,
                      'Shortname': company.companyshortname,
                      'Business Cont': company.contact,
                      'Address': company.address,
                      'Country': company.country,
                      'State': company.state,
                      'City': company.city,
                      'Zip code': company.zipcode,
                      'Active': company.active,
                      'Revenue': company.revenue,
                      'Currency' : company.currency
                    };
                });
                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, this.fileName);
                this.messageService.add({ severity: 'success', summary: 'Downloaded', detail: 'Company Details Downloaded Successfully' });
            } else {
                console.error('No companies found.');
            }
        });
  }

  

  showFilter(){
    this.showwwww = !this.showwwww;
  }

    erase(demo: Table) {
      this.messageService.add({ severity: 'info', summary: 'Clear', detail: 'Column Filter has been Cleared' });
    Object.keys(demo.filters).forEach(key => {
      const filter = demo.filters[key];
      if (Array.isArray(filter)) {
        filter.forEach((f: any) => f.value = null);
      } else {
        filter.value = null;
      }
    });

    

    const event: TableLazyLoadEvent = {
      first: 0,
      rows:this.showval
    };
    this.loadCompanies(event)
  }

    reload(){
      this.messageService.add({ severity: 'success', summary: 'Reload', detail: 'Company Details Reloaded' });
    this.showwwww = false;
    this.demoTable.reset();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = ''; 
    }

  
  }

  PrintPage(){
    window.print();
  }

  constructor(
    private companyService: CompanyserviceService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadCompanies({
      first: 0,
      rows: 10,
      sortField: undefined,
      sortOrder: 1,
      filters: {},
      globalFilter: ''
    });
    this.loadCountry();
    this.loadState();
    this.loadCity();

   
  }


  
  
  loadCompanies(event : TableLazyLoadEvent): void {
      this.animation = true;
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
 
      this.companyService.lazyData2(event.first || 0, event.rows || 10, sortField, sortOrder, searchField, sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds,globalFilter)
        .subscribe(companies => {
          this.animation = false;
          if (companies && companies.length > 0) {
            this.companys = companies;
            this.total_record = companies[0].total_records;
          } else {
            console.error('No companies found.');
          }
        });
  }



  loadCountry(): void {
    this.companyService.getCountry().subscribe({
      next: (countrys) => {
        this.countrys = countrys;
        this.cdr.detectChanges(); 
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  loadState(): void {
    this.companyService.getState().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  loadCity(): void {
    this.companyService.getCity().subscribe({
      next: (citys) => {
        this.citys = citys;
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  onCountryChange(event: Country[]): void {
    if(event){
      const selectedCountryIds: number[] = [];
      this.selectedCountryIds=[];
      this.selectedStateIds=[];
      event.forEach(country => {
        selectedCountryIds.push(country.cid);
      });
      if(selectedCountryIds.length==0){
        this.loadCity();
        this.loadState();
      }
      if (selectedCountryIds.length > 0) {
        this.getStatesByIds(selectedCountryIds);
        this.getCitybyCountryIds(selectedCountryIds);
      }
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

  onStateChange(event: State[]): void {
    if(event){
      const selectedStateIds: number[] = [];
      event.forEach(states => {
        selectedStateIds.push(states.sid);
      });
      if(selectedStateIds.length==0){
        this.loadCity();
      }
      this.selectedStateIds=[];
      this.selectedCity = [];
      this.selectedCityIds = [];
      if (selectedStateIds.length > 0) {
        this.getCityBystateIds(selectedStateIds);  
      }
    }
  }

  onCityChange(event: State[]): void {
    if(event){
      this.selectedCityIds=[];
    }
  }

  getCityBystateIds(selectedCountryIds: number[]): void {
    this.companyService.getCityBystateIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });

    this.selectedCityIds=[];
  }

  onSubmit() {
    this.selectedCity.map(city => this.selectedCityIds.push(city.cityid));
    this.selectedState.map(state => this.selectedStateIds.push(state.sid));
    this.selectedCountry.map(country => this.selectedCountryIds.push(country.cid));
    if(this.selectedCity.length==0 && this.selectedState.length==0 && this.selectedCountry.length==0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one filter before submitting.' });
    }

    if(this.selectedCityIds.length ==0 && this.selectedCountryIds.length ==0 && this.selectedStateIds.length ==0) {
      const event: TableLazyLoadEvent = {
        first: 0,
        rows: this.showval,
        sortField: undefined, 
        sortOrder: null,
        globalFilter:this.globalFilter
      };

      this.animation = true;
      setTimeout(() => {
        console.log(event);
        this.loadCompanies(event);
        this.animation = false;
      }, 500);

    }
    else{
      const event: TableLazyLoadEvent = {
        first: 0,
        rows: this.showval,
        sortField: undefined, 
        sortOrder: 1, 
        globalFilter:this.globalFilter
      };
    
      this.loadCompanies(event);
    }
  }

  clearForm(form: any): void {
    form.resetForm();
    this.selectedCityIds = [];
    this.selectedCountryIds = [];
    this.selectedStateIds = [];
    this.selectedCountry = [];
    this.selectedCity=[];
    this.selectedState = [];
    if (this.filterInput) {
      this.filterInput.nativeElement.value = ''; 
    }
    this.loadCountry();
    this.loadState();
    this.loadCity();
    this.demoTable.reset();
    this.showwwww = false;
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Filters cleared successfully.' });
  }

}
