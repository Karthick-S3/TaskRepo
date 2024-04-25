using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.SignalR;
using Microsoft.OpenApi.Any;

namespace Backend.Contract
{
    public interface ICompanydetailsRepository
    {


        public IEnumerable<Countrydetails> GetCountry();

        public IEnumerable<Statedetails> GetState();

        public IEnumerable<Citydetails> GetCity();

      
       
        public Task<IEnumerable<Statedetails>> GetStatesByCountries(int[] ids);

        public Task<IEnumerable<Citydetails>> GetCitysByCountries(int[] ids);

        public Task<IEnumerable<Citydetails>> GetCityByState(int[] ids);



        public Task<IEnumerable<Companydetails>> LazyData2(int skip,int take,string? orderby,bool isAsc,string[]?  searchfield,string[]? sfieldvalue,int[]? countries,int[]? states, int[]? cities);
       
        //insert

        public  Task<Companydetails> AddCompany(Companydetails companydetails);


        // get by id

        public Task<Companydetails> GetCompany(int id);

        public Task UpdateCompany(Companydetails companydetails);

    
        
       
    }

  
}