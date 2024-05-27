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
       private readonly string _uploadFolder;

        public CompanydetailsController (ICompanydetailsRepository companydetailsRepository,string uploadFolder){
            _companydetailsRepositry = companydetailsRepository;
             _uploadFolder = uploadFolder ?? throw new ArgumentNullException(nameof(uploadFolder));
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


    [HttpGet("shortnamebyid")]
    public async Task<IActionResult> getShortNamebyid([FromQuery] int id)
    {
        try
        {
            var company = await _companydetailsRepositry.getShortNamebyid(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }


  
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBudgetDetailLine([FromQuery] int[] ids)
        {
            try
            {
                await _companydetailsRepositry.DeleteBudgetDetailLine(ids);
                return Ok("Budget detail lines deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
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


        [HttpPost("uploadfiles")]
        public async Task<IActionResult> uploadfiles([FromForm] List<IFormFile> files, [FromQuery] int companyId)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files uploaded."+files+"company id"+companyId);
            }

            foreach (var file in files)
            {
                var storedName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(_uploadFolder, storedName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var filesDetails = new filesdetails
                {
                    originalname = file.FileName,
                    storedname = storedName,
                    filesize = file.Length,
                    uploaddate = DateTime.Now,
                    companyid = companyId
                };

                int newId = await _companydetailsRepositry.uploadfiles(filesDetails);
            }

              return Ok(new { message = "Files uploaded successfully." });
        }



       [HttpGet("getfilesbycompanyid")]
        public async Task<IActionResult> GetFilesByCompanyId([FromQuery] int companyId)
        {
            if (companyId <= 0)
            {
                return Ok("Invalid company ID.");
            }

            var files = await _companydetailsRepositry.getFilesbyId(companyId);

            if (files == null || !files.Any())
            {
                return Ok("No files found for the given company ID.");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/uploads/";

            var fileDetailsWithUrls = files.Select(file => new
            {
                file.fid,
                file.originalname,
                file.storedname,
                file.filesize,
                file.uploaddate,
                file.companyid,
                Url = $"{baseUrl}{file.storedname}"
            });

            return Ok(fileDetailsWithUrls);
        }




      

        
    }
}