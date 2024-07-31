import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { Company } from './Interfaces/company';
import { Country } from './Interfaces/country';
import { State } from './Interfaces/state';
import { City } from './Interfaces/city';
import { Budget } from './Interfaces/budget';
import { Currency } from './Interfaces/currency';
import { BudgetDetail } from './Interfaces/budgetdetail';
import { Filedetail } from './Interfaces/filesdetail';
import { response } from 'express';



@Injectable({
  providedIn: 'root'
})
export class CompanyserviceService {


 

  [x: string]: any;


  baseApiUrl : string = "http://localhost:5197";
  
  constructor( private http:HttpClient) { }



  getCountry():Observable<Country[]>
  {
    return this.http.get<Country[]>(this.baseApiUrl+'/api/companyDetails/country')
  }


  getState():Observable<State[]>
  {
    return this.http.get<State[]>(this.baseApiUrl+'/api/companyDetails/state')
  }

  getCity():Observable<City[]>
  {
    return this.http.get<City[]>(this.baseApiUrl+'/api/companyDetails/city')
  }


  getStateByCountry(num:number): Observable<State[]> {
    return this.http.get<State[]>(this.baseApiUrl+'/api/companyDetails/'+num);
  }

  

  getStatesByIds(selectedCountryIds: number[]): Observable<State[]> {
    let queryString = '';
    if (selectedCountryIds && selectedCountryIds.length > 0) {
      queryString = selectedCountryIds.map(id => `ids=${id}`).join('&');
    }
    
    const url = `${this.baseApiUrl}/api/Companydetails/statebcountry?${queryString}`;
  
    return this.http.get<State[]>(url);
  }



  getCityBystateIds(selectedStateIds: number[]): Observable<City[]> {
    let queryString = '';
    if (selectedStateIds && selectedStateIds.length > 0) {
      queryString = selectedStateIds.map(id => `ids=${id}`).join('&');
    }
    
    const url = `${this.baseApiUrl}/api/Companydetails/citybstate?${queryString}`;
  
    return this.http.get<City[]>(url);
  }
  






  getCitybyCountryIds(selectedCityIds: number[]): Observable<City[]> {
    let queryString = '';
    if (selectedCityIds && selectedCityIds.length > 0) {
      queryString = selectedCityIds.map(id => `ids=${id}`).join('&');
    }
    
    const url = `${this.baseApiUrl}/api/Companydetails/citybcountry?${queryString}`;
  
    return this.http.get<City[]>(url);
  }
  
  

  lazyData2(
    skip: number,
    take: number,
    orderby: string | undefined,
    isAsc: boolean,
    searchField: string[] | undefined,
    sFieldValue: string[] | undefined,
    countries: number[] | undefined,
    states: number[] | undefined,
    cities: number[] | undefined,
    globalFilter: string  | undefined
  ): Observable<Company[]> {

    let queryString = `skip=${skip}&take=${take}`;
    if (orderby) {
      queryString += `&orderby=${orderby}&isAsc=${isAsc}`;
    }
    if (searchField && sFieldValue) {
      for (let i = 0; i < searchField.length; i++) {
        queryString += `&searchField=${searchField[i]}&sFieldValue=${sFieldValue[i]}`;
      }
    }
    if (countries) {
      countries.forEach(country => {
        queryString += `&countries=${country}`;
      });
    }
    if (states) {
      states.forEach(state => {
        queryString += `&states=${state}`;
      });
    }
    if (cities) {
      cities.forEach(city => {
        queryString += `&cities=${city}`;
      });
    }

    if (globalFilter) {
      queryString += `&globalfilter=${globalFilter}`;
    }


    const url = `${this.baseApiUrl}/api/Companydetails/Lazy?${queryString}`;

    return this.http.get<Company[]>(url);
}




insertCompany(company: Company): Observable<Company> {
  return this.http.post<Company>(`${this.baseApiUrl}/api/Companydetails/insert`, company);
}




// fetch by id

getById(id : number): Observable<Company>{
 const val =  `${this.baseApiUrl}/api/Companydetails/byId?id=${id}`;
 return this.http.get<Company>(val);
}

//update data 

updateCompany(company: Company):Observable<Company>{
  const val =  this.http.put<Company>(`${this.baseApiUrl}/api/Companydetails/Update`, company);
  return val;
}


// Service method to insert budget detail lines
insertBudgetLines(budgetdetail: BudgetDetail): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/Companydetails/insertbudgetlines`, budgetdetail);
}





updatebudgetlines(budgetdetail: BudgetDetail) : Observable<any>{
  const val =  this.http.put<any>(`${this.baseApiUrl}/api/Companydetails/updatebudgetlines`, budgetdetail);
  return val;
}


insertBudget(budget: Budget): Observable<Budget> {
  return this.http.post<Budget>(`${this.baseApiUrl}/api/Companydetails/insertbudget`, budget);
}

updateBudget(budget: Budget): Observable<Budget> {
  return this.http.post<Budget>(`${this.baseApiUrl}/api/Companydetails/updatebudget`, budget);
}



//////////////////////////////////////////// budget //////////////////////////////////////////////////////


LazyDataBudget(
  skip: number,
  take: number,
  orderby: string | undefined,
  isAsc: boolean,
  searchField: string[] | undefined,
  sFieldValue: string[] | undefined,
  globalFilter: string  | undefined
): Observable<Budget[]> {
  let queryString = `skip=${skip}&take=${take}`;
  if (orderby) {
    queryString += `&orderby=${orderby}&isAsc=${isAsc}`;
  }
  if (searchField && sFieldValue) {
    for (let i = 0; i < searchField.length; i++) {
      queryString += `&searchField=${searchField[i]}&sFieldValue=${sFieldValue[i]}`;
    }
  }

  if (globalFilter) {
    queryString += `&globalfilter=${globalFilter}`;
  }


  const url = `${this.baseApiUrl}/api/Companydetails/LazyBudget?${queryString}`;
  return this.http.get<Budget[]>(url);
}

LazyDataBudgetDetail(
  skip: number,
  take: number,
  orderby: string | undefined,
  isAsc: boolean,
  searchField: string[] | undefined,
  sFieldValue: string[] | undefined,
  globalFilter: string  | undefined,
  id : number
): Observable<BudgetDetail[]> {
  let queryString = `skip=${skip}&take=${take}`;
  if (orderby) {
    queryString += `&orderby=${orderby}&isAsc=${isAsc}`;
  }
  if (searchField && sFieldValue) {
    for (let i = 0; i < searchField.length; i++) {
      queryString += `&searchField=${searchField[i]}&sFieldValue=${sFieldValue[i]}`;
    }
  }

  if (globalFilter) {
    queryString += `&globalfilter=${globalFilter}`;
  }
  if(id){
    queryString += `&id=${id}`;
  }


  const url = `${this.baseApiUrl}/api/Companydetails/LazyBudgetDetail?${queryString}`;
  return this.http.get<BudgetDetail[]>(url);
}

getShortNameByid(id : number):Observable<Company[]>{
  const val =  this.http.get<Company[]>(`${this.baseApiUrl}/api/Companydetails/shortnamebyid?id=${id}`);
  return val;
}


getShortName():Observable<Company[]>{
  const val =  this.http.get<Company[]>(`${this.baseApiUrl}/api/Companydetails/shortname`);
  return val;
}

GetCurrency():Observable<Currency[]>{
  const val =  (`${this.baseApiUrl}/api/Companydetails/currency`);
  return this.http.get<Currency[]>(val);

}


deleteDetailLine(ids: number[]): Observable<string> { 
  let idParams = '';
  for (let i = 0; i < ids.length; i++) {
    idParams += `ids=${ids[i]}`;
    if (i !== ids.length - 1) {
      idParams += '&';
    }
  }
  const url = `${this.baseApiUrl}/api/Companydetails/delete?${idParams}`;
  return this.http.delete(url, { responseType: 'text' }); 
}

uploadFiles(formData: FormData, companyId: number): Observable<Filedetail> {
  formData.append('companyId', companyId.toString());
  return this.http.post<Filedetail>(`${this.baseApiUrl}/api/Companydetails/uploadfiles?companyId=${companyId}`, formData);
}

getFilesByID(companyId: number): Observable<Filedetail[]> {
  return this.http.get<Filedetail[]>(`${this.baseApiUrl}/api/Companydetails/getFilesByCompanyId?companyId=${companyId}`);
}

getServiceStatus(serviceName: string): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/Companydetails/GetServiceStatus?serviceName=${serviceName}`);
}

startService(serviceName: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseApiUrl}/api/Companydetails/start?serviceName=${serviceName}`, null, { headers });
}


stopService(serviceName: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseApiUrl}/api/Companydetails/stop?serviceName=${serviceName}`, null, { headers });
}

UserLogin(username: string, password: string): Observable<any> {
  const url = `${this.baseApiUrl}/api/Companydetails/login?username=${username}&password=${password}`;
  return this.http.get(url).pipe(map(response => {
    return response;
  }));
}

}
