using Backend.Contract;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ServiceProcess;
using System.Diagnostics;
using Backend.Repository;
using System.ServiceProcess;
using System.Management;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Backend.Services;




namespace Backend.Controllers
{
  
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CompanydetailsController : ControllerBase
    {

        // private readonly ICompServices _serviceProcess;
        private readonly ICompanydetailsRepository  _companydetailsRepositry;
        private readonly MyWorkerService _serviceProcess;
        private readonly string _uploadFolder;

        private readonly  IConfiguration _configuration;



        public static User user = new User();

        



        public CompanydetailsController (IConfiguration configuration,ICompanydetailsRepository companydetailsRepository,string uploadFolder,MyWorkerService myWorkerService){
            _companydetailsRepositry = companydetailsRepository;
             _uploadFolder = uploadFolder ?? throw new ArgumentNullException(nameof(uploadFolder));
              _serviceProcess = myWorkerService ?? throw new ArgumentNullException(nameof(myWorkerService));
            _configuration = configuration;

        }



              
            [HttpGet("login")]
            [AllowAnonymous]
            public async Task<IActionResult> UserLogin([FromQuery] string username, [FromQuery] string password)
            {
                try
                {
                    var user = await _companydetailsRepositry.UserLogin(username, password);

                    if (user == null)
                    {
                        return Unauthorized("Invalid credentials");
                    }

                    string token = CreateToken(user);
                    return Ok(new { Token = token });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Login Failed {ex.Message}");
                }
            }

            private string CreateToken(User user)
            {
                List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration.GetSection("AppSettings:Token").Value!
                ));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var token = new JwtSecurityToken(
                    claims: claims,
                     expires: DateTime.Now.AddMinutes(60),
                    signingCredentials: creds
                );

                var jwt = new JwtSecurityTokenHandler().WriteToken(token);

                return jwt;
            }




        //  [HttpGet("serviceName")]
        // public IActionResult GetServiceStatus([FromQuery]string serviceName)
        // {
        //     try
        //     {
        //         using (var serviceController = new ServiceController(serviceName))
        //         {
        //             var status = serviceController.Status;
        //             return Ok(new { ServiceName = serviceName, Status = status.ToString() });
        //         }
        //     }
        //     catch (System.Exception ex)
        //     {
        //         return StatusCode(500, $"Error fetching status for service {serviceName}: {ex.Message}");
        //     }
        // }


        [HttpGet("GetServiceStatus")]
        
public IActionResult GetServiceStatus([FromQuery] string serviceName)
{
    try
    {
        using (var serviceController = new ServiceController(serviceName))
        {
            var status = serviceController.Status;
            var (serviceProcessId, startupType) = GetServiceProcessIdAndStartupType(serviceController);
            if (serviceProcessId == -1)
            {
                return StatusCode(500, $"Could not find process for service {serviceName}");
            }
            var process = Process.GetProcessById(serviceProcessId);
            Thread.Sleep(1000);
            process.Refresh();
            var workingSetMemory = process.WorkingSet64;
            var workingSetMemoryMB = BytesToMegabytes(workingSetMemory);
            return Ok(new
            {
                ServiceName = serviceName,
                DisplayName = serviceController.DisplayName,
                Status = status.ToString(),
                StartupType = startupType,
                WorkingSetMemoryMB = workingSetMemoryMB.ToString("0.00") + " MB"
            });
        }
    }
    catch (System.Exception ex)
    {
        return StatusCode(500, $"Error fetching status or memory usage for service {serviceName}: {ex.Message}");
    }
}

private (int, string) GetServiceProcessIdAndStartupType(ServiceController serviceController)
{
    try
    {
        var wmiQuery = $"SELECT ProcessId, StartMode FROM Win32_Service WHERE Name = '{serviceController.ServiceName}'";
        using (var searcher = new System.Management.ManagementObjectSearcher(wmiQuery))
        using (var results = searcher.Get())
        {
            foreach (var result in results)
            {
                var processId = Convert.ToInt32(result["ProcessId"]);
                var startupType = result["StartMode"].ToString();
                return (processId, startupType);
            }
        }
    }
    catch
    {
        // Handle or log the exception as necessary
    }

    return (-1, "Unknown");
}

private static double BytesToMegabytes(long bytes)
{
    return bytes / (1024f * 1024f);
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
        // [Authorize]
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


[HttpPost("updatebudget")]
public async Task<IActionResult> UpdateBudgetDetail([FromBody] Budgetdetails budgetDetails)
{
    try
    {
        await _companydetailsRepositry.UpdateBudgetDetail(budgetDetails);
        return Ok(new { message = "Budget details updated successfully." });
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
    public async Task<IActionResult> UploadFiles([FromForm] List<IFormFile> files, [FromQuery] int companyId)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest("No files uploaded. Company ID: " + companyId);
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

    [HttpGet("getFilesByCompanyId")]
    public async Task<IActionResult> GetFilesByCompanyId([FromQuery] int companyId)
    {
        if (companyId <= 0)
        {
            return BadRequest("Invalid company ID.");
        }

        var files = await _companydetailsRepositry.GetFilesById(companyId);

        if (files == null || !files.Any())
        {
           return Ok();
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



        [HttpPost("start")]
        public async Task<IActionResult> StartService([FromQuery]string serviceName)
        {
            try
            {
                await _serviceProcess.StartService(serviceName);
               return Ok(new { message = "Service started successfully." });


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error starting service: {ex.Message}");
            }
        }

        [HttpPost("stop")]
        public async Task<IActionResult> StopService([FromQuery] string serviceName)
        {
            try
            {
                await _serviceProcess.StopService(serviceName);
                return Ok(new { message = "Service stopped successfully." });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error stopping service: {ex.Message}");
            }
        }


  
        


      


        




    }       
}
