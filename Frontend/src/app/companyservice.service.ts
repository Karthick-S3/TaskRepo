import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Company } from './Interfaces/company';
import { Country } from './Interfaces/country';
import { State } from './Interfaces/state';
import { City } from './Interfaces/city';

import { TableLazyLoadEvent } from 'primeng/table';
import { compileDeclareNgModuleFromMetadata } from '@angular/compiler';

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
    cities: number[] | undefined
  ): Observable<Company[]> {
    // Construct the query string
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

    const url = `${this.baseApiUrl}/api/Companydetails/Lazy2?${queryString}`;

    return this.http.get<Company[]>(url);
}




insertCompany(company: Company): Observable<Company> {
  console.log("Service",company);
  return this.http.post<Company>(`${this.baseApiUrl}/api/Companydetails/insert`, company);
}




// fetch by id

getById(id : number): Observable<Company>{
 const val =  `${this.baseApiUrl}/api/Companydetails/byId?id=${id}`;
 return this.http.get<Company>(val);
}

//update data 

updateCompany(company: Company):Observable<Company>{
  console.log("calling",company);
  
  const val =  this.http.put<Company>(`${this.baseApiUrl}/api/Companydetails/Update`, company);
  console.log(val);

  return val;
}



}
