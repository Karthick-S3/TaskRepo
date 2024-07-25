using Backend.Models;


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



        public Task<IEnumerable<Companydetails>> LazyData(int skip,int take,string? orderby,bool isAsc,string[]?  searchfield,string[]? sfieldvalue,int[]? countries,int[]? states, int[]? cities, string globalfilter);
       
        //insert

        public  Task<Companydetails> AddCompany(Companydetails companydetails);


        // get by id

        public Task<Companydetails> GetCompany(int id);

        public Task UpdateCompany(Companydetails companydetails);




        //budget 


        public Task<IEnumerable<Budgetdetails>> LazyDataBudget(int skip,int take,string? orderby,bool isAsc,string[]?  searchfield,string[]? sfieldvalue,string globalfilter);

        public Task<IEnumerable<Budgetdetailline>> LazyBudgetDetail(int skip,int take,string? orderby,bool isAsc,string[]?  searchfield,string[]? sfieldvalue,string globalfilter,int id);

        public Task<IEnumerable<Companydetails>> getShortName();

        public Task<IEnumerable<Companydetails>> getShortNamebyid(int id);

        public Task<IEnumerable<Currencydetails>> GetCurrency();

        public Task DeleteBudgetDetailLine(int[] ids);



        public Task UpdateBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines);

        public Task InsertBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines);


        // public Task<IEnumerable<Budgetdetails>> AddBudget(Budgetdetails budgetdetails);

        public  Task<int> InsertBudgetDetail(Budgetdetails budgetDetails);

        public Task UpdateBudgetDetail(Budgetdetails budgetDetails);


        public Task<int> uploadfiles(filesdetails filesDetails);

        public Task<IEnumerable<filesdetails>> GetFilesById(int companyid);


        public Task<User> UserLogin(string username,string password);
       
    }

  
}