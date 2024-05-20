using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Backend.Contract;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanydetailsController : ControllerBase
    {
        private readonly ICompanydetailsRepository  _companydetailsRepositry;

        public CompanydetailsController (ICompanydetailsRepository companydetailsRepository){
            _companydetailsRepositry = companydetailsRepository;
        }


       




        [HttpGet("statebcountry")]
        public async Task<IActionResult> GetStatesByCountries([FromQuery] int[] ids)
        {
            try{
            var filteredStates = await _companydetailsRepositry.GetStatesByCountries(ids);
            return Ok(filteredStates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
                throw;
            }
        }

        [HttpGet("citybcountry")]
        public async Task<IActionResult> GetCitysByCountries([FromQuery] int[] ids)
        {
            try{
            var filteredStates = await _companydetailsRepositry.GetCitysByCountries(ids);
            return Ok(filteredStates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
                throw;
            }
        }

        [HttpGet("citybstate")]
        public async Task<IActionResult> GetCityByState([FromQuery] int[] ids)
        {
            try{
            var filteredStates = await _companydetailsRepositry.GetCityByState(ids);
            return Ok(filteredStates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
                throw;
            }
        }






        [HttpGet("country")]
        public IActionResult GetCountry(){
            try{
                var countrydetail = _companydetailsRepositry.GetCountry();
                return Ok(countrydetail);
            }
            catch(Exception ex){
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("state")]
        public IActionResult GetState(){
            try{
                var statedetails = _companydetailsRepositry.GetState();
                return Ok(statedetails);
            }
            catch(Exception ex){
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("city")]
        public IActionResult GetCity(){
            try{
                var citydetails =  _companydetailsRepositry.GetCity();
                return Ok(citydetails);
            }
            catch(Exception ex){
                return StatusCode(500, ex.Message);
            }
        }


        

        
        




         [HttpGet("Lazy")]
        public async Task<IActionResult> LazyData(
            [FromQuery] int skip,
            [FromQuery] int take,
            [FromQuery] string? orderby,
            [FromQuery] bool isAsc,
            [FromQuery] string[]? searchField,
            [FromQuery] string[]? sFieldValue,
            [FromQuery] int[]? countries,
            [FromQuery] int[]? states,
            [FromQuery] int[]? cities,
            [FromQuery] string? globalfilter)
        {
            try
            {
                
                var data = await _companydetailsRepositry.LazyData(
                    skip,
                    take,
                    orderby,
                    isAsc,
                    searchField,
                    sFieldValue,
                    countries,
                    states,
                    cities,
                    globalfilter);

                return Ok(data);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        




  


    [HttpPost("insert")]

      public async Task<IActionResult> AddCompany(Companydetails companydetails){
        try{
            var insert = await _companydetailsRepositry.AddCompany(companydetails);
            return Ok(insert);
        }
        catch(Exception ex){
            return StatusCode(500, ex.Message);
        }
      }

      [HttpPut("Update")] 
        public async Task<IActionResult> UpdateCompany(Companydetails companydetails)
        {
            try
            {
                await _companydetailsRepositry.UpdateCompany(companydetails);
                return Ok(companydetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



    [HttpGet("byId")]
    public async Task<IActionResult> GetCompany([FromQuery]int id)
    {
        try
        {
            var company = await _companydetailsRepositry.GetCompany(id);
            return Ok(company);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }


  


    




  
     [HttpPut("updatebudgetlines")]
        public async Task<IActionResult> UpdateBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines)
        {
            try
            {
                await _companydetailsRepositry.UpdateBudgetLines(budgetdetaillines);
                return Ok(budgetdetaillines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        



      


    




      [HttpPost("insertbudgetlines")]
public async Task<IActionResult> InsertBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines)
{
    try
    {
        await _companydetailsRepositry.InsertBudgetLines(budgetdetaillines);
        return Ok(budgetdetaillines);
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.Message);
    }
}


[HttpPost("insertbudget")]
public async Task<IActionResult> InsertBudgetDetail([FromBody] Budgetdetails budgetDetails)
{
    try
    {
        int generatedBudgetId = await _companydetailsRepositry.InsertBudgetDetail(budgetDetails);
        return Ok(generatedBudgetId); 
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.Message);
    }
}





    //Budget


  [HttpGet("LazyBudget")]
        public async Task<IActionResult> LazyDataBudget(
            [FromQuery] int skip,
            [FromQuery] int take,
            [FromQuery] string? orderby,
            [FromQuery] bool isAsc,
            [FromQuery] string[]? searchField,
            [FromQuery] string[]? sFieldValue,
            [FromQuery] string? globalfilter)
        {
            try
            {
                
                var data = await _companydetailsRepositry.LazyDataBudget(
                    skip,
                    take,
                    orderby,
                    isAsc,
                    searchField,
                    sFieldValue,
                    globalfilter);

                return Ok(data);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    

     [HttpGet("LazyBudgetDetail")]
        public async Task<IActionResult> LazyBudgetDetail(
            [FromQuery] int skip,
            [FromQuery] int take,
            [FromQuery] string? orderby,
            [FromQuery] bool isAsc,
            [FromQuery] string[]? searchField,
            [FromQuery] string[]? sFieldValue,
            [FromQuery] string? globalfilter,
            [FromQuery] int id)
        {
            try
            {
                
                var data = await _companydetailsRepositry.LazyBudgetDetail(
                    skip,
                    take,
                    orderby,
                    isAsc,
                    searchField,
                    sFieldValue,
                    globalfilter,
                    id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

    [HttpGet("shortname")]

    public async Task<IActionResult> getShortName(){
        var data = await _companydetailsRepositry.getShortName();
        return Ok(data);
    }

     [HttpGet("currency")]

    public async Task<IActionResult> GetCurrency(){
        var data = await _companydetailsRepositry.GetCurrency();
        return Ok(data);
    }

      

        
    }
}