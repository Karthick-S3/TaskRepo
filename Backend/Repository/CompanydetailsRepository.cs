using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Backend.Context;
using Backend.Contract;
using Backend.Models;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System;
using System.Collections.Generic;
using Dapper.Oracle;
using System.Text;
using System.DirectoryServices.Protocols;
using Microsoft.OpenApi.Any;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Linq;
using Oracle.ManagedDataAccess.Types;




namespace Backend.Repository
{
    public class CompanydetailsRepository : ICompanydetailsRepository
    {

        private readonly DapperContext _context;

        public CompanydetailsRepository( DapperContext context)
        {
            _context = context;
        }





        public IEnumerable<Countrydetails> GetCountry(){
            try
            {
            using (var connection = _context.CreateConnection())
            {
           
                List<Countrydetails> countrylist = new List<Countrydetails>();
                var oracleDynamicParameters = new OracleDynamicParameters();
                oracleDynamicParameters.Add("OUT_COUNTRY", dbType: OracleMappingType.RefCursor, direction: ParameterDirection.Output);
    
                using (var con = _context.CreateConnection())
                {
    
                    con.Open();
                    countrylist = connection.Query<Countrydetails>("COMPANYDETAIL_PACKAGE.getCountry", oracleDynamicParameters, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();            
                    return countrylist;
            
                }
            }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        
        public IEnumerable<Statedetails> GetState(){
            try
            {
            using (var connection = _context.CreateConnection())
            {
           
                List<Statedetails> countrylist = new List<Statedetails>();
                var oracleDynamicParameters = new OracleDynamicParameters();
                oracleDynamicParameters.Add("OUT_STATE", dbType: OracleMappingType.RefCursor, direction: ParameterDirection.Output);
    
                using (var con = _context.CreateConnection())
                {
    
                    con.Open();
                    countrylist = connection.Query<Statedetails>("COMPANYDETAIL_PACKAGE.getState", oracleDynamicParameters, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();            
                    return countrylist;
            
                }
            }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

       


        public IEnumerable<Citydetails> GetCity(){
            try
            {
            using (var connection = _context.CreateConnection())
            {
           
                List<Citydetails> countrylist = new List<Citydetails>();
                var oracleDynamicParameters = new OracleDynamicParameters();
                oracleDynamicParameters.Add("OUT_CITY", dbType: OracleMappingType.RefCursor, direction: ParameterDirection.Output);
    
                using (var con = _context.CreateConnection())
                {
    
                    con.Open();
                    countrylist = connection.Query<Citydetails>("COMPANYDETAIL_PACKAGE.getCity", oracleDynamicParameters, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();            
                    return countrylist;
            
                }
            }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }



        // Filter By State And City 

        public async Task<IEnumerable<Statedetails>> GetStatesByCountries(int[] ids)
        {
            try
            {
                var query = @"SELECT s.state,s.sid,s.cid
                            FROM statedetail s
                            JOIN countrydetail c ON s.cid = c.cid
                            WHERE c.cid IN :Ids";

                using (var connection = _context.CreateConnection())
                {
                    connection.Open();
                    var filteredStates = await connection.QueryAsync<Statedetails>(query, new { Ids = ids });
                    connection.Close();
                    return filteredStates;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }




        public async Task<IEnumerable<Citydetails>> GetCitysByCountries(int[] ids)
        {
            try
            {
            var query = @"SELECT cit.city,cit.cid,cit.sid,cit.cityid
                        FROM citydetail cit
                        JOIN countrydetail c ON cit.cid = c.cid
                        WHERE c.cid IN :Ids";
                  
                        using(var connection = _context.CreateConnection())
                        {
                            connection.Open();
                            var filteredCity = await connection.QueryAsync<Citydetails>(query, new { Ids = ids });
                            connection.Close();
                            return filteredCity;
                        }
                        }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }


        public async Task<IEnumerable<Citydetails>> GetCityByState(int[] ids)
        {
           try{

            var query = @"SELECT cit.city,cit.cid,cit.sid,cit.cityid
                        FROM citydetail cit
                        JOIN statedetail s ON cit.sid = s.sid
                        WHERE s.sid IN :Ids";
                  
                using(var connection = _context.CreateConnection())
                {
                    connection.Open();
                    var filteredCity = await connection.QueryAsync<Citydetails>(query, new { Ids = ids });
                    connection.Close();
                    return filteredCity;
                }
                }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }


// try


public async Task<IEnumerable<Companydetails>> LazyData(int skip, int take, string? orderby, bool isAsc, string[]? searchfield, string[]? sfieldvalue, int[]? countries, int[]? states, int[]? cities, string globalfilter)
        {
             try
    {
         var query = new StringBuilder();
        query.Append(@"SELECT 
                        cd.companyid, cd.companyname, con.contact, cd.companyshortname,
                        cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
                        cd.establish_date, cd.REVENUE,
                        COUNT(*) OVER() AS total_records,cu.currency,bu.budgetid
                        FROM 
                            companydetail cd
                        JOIN 
                            countrydetail co ON co.cid = cd.cid
                        JOIN 
                            statedetail st ON st.sid = cd.sid
                        JOIN 
                            citydetail ci ON ci.cityid = cd.cityid
                        JOIN 
                            contactdetail con ON con.contactid = cd.contactid
                        LEFT JOIN 
                            budgetdetail bu ON bu.budgetid = cd.budgetid
                        LEFT JOIN
                            currencydetail cu ON cu.currencyid = cd.currencyid");

        // Add global filter
        if (!string.IsNullOrEmpty(globalfilter))
        {
            query.Append(" WHERE ");
            query.Append("(");
            query.Append($"lower(cd.companyid) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(co.country) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.companyname) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(con.contact) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.companyshortname) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.address) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.zipcode) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(st.state) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(ci.city) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.establish_date) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cu.currency) LIKE lower('%{globalfilter}%') OR ");
            query.Append($"lower(cd.REVENUE) LIKE lower('%{globalfilter}%')");
            query.Append(") ");
        }

        // Add additional filters (countries, states, cities)
        if (countries != null && countries.Any())
        {
            if (!string.IsNullOrEmpty(globalfilter))
                query.Append(" AND ");
            else
                query.Append(" WHERE ");
            query.Append($" co.cid IN ({string.Join(",", countries)})");
        }

        if (states != null && states.Any())
        {
            if (!string.IsNullOrEmpty(globalfilter) || (countries != null && countries.Any()))
                query.Append(" AND ");
            else
                query.Append(" WHERE ");
            query.Append($" st.sid IN ({string.Join(",", states)})");
        }

        if (cities != null && cities.Any())
        {
            if (!string.IsNullOrEmpty(globalfilter) || (countries != null && countries.Any()) || (states != null && states.Any()))
                query.Append(" AND ");
            else
                query.Append(" WHERE ");
            query.Append($" ci.cityid IN ({string.Join(",", cities)})");
        }

        // Add search filters
        if (searchfield != null && searchfield.Length > 0 && sfieldvalue != null && sfieldvalue.Length > 0)
        {
            if (!string.IsNullOrEmpty(globalfilter) || (countries != null && countries.Any()) || (states != null && states.Any()) || (cities != null && cities.Any()))
                query.Append(" AND ");
            else
                query.Append(" WHERE ");
            for (int i = 0; i < searchfield.Length; i++)
            {
                if (i > 0)
                    query.Append(" AND ");
                query.Append($"lower({searchfield[i]}) LIKE lower('%{sfieldvalue[i]}%')");
            }
        }

        // Add ordering and pagination
        if (!string.IsNullOrEmpty(orderby))
        {
            query.Append($" ORDER BY {orderby} {(isAsc ? "ASC" : "DESC")}");
        }
        else
        {
            query.Append(" ORDER BY companyid ASC");
        }

        query.Append($" OFFSET {skip} ROWS FETCH NEXT {take} ROWS ONLY");

                       
                        using (var connection = _context.CreateConnection())
                        {
                            var result = await connection.QueryAsync<Companydetails>(query.ToString()).ConfigureAwait(false);
                            return result;
                        }
            }
            catch (Exception ex)
            {
                
                Console.WriteLine("An error occurred: " + ex.Message);
                throw; 
            }
        }





// try end


        public async Task<Companydetails> AddCompany(Companydetails companydetails)
        {
            try{
                using (var connection = _context.CreateConnection())
                {
                    var oracleParams = new OracleDynamicParameters();
                    oracleParams.Add("p_contact", companydetails.contact, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_companyname", companydetails.companyname, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_companyshortname", companydetails.companyshortname, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_address", companydetails.Address, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_zipcode", companydetails.zipcode, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_active", companydetails.active, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_cid", companydetails.cid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_sid", companydetails.sid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_cityid", companydetails.cityid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_revenue", companydetails.revenue, OracleMappingType.Decimal, ParameterDirection.Input);
                    oracleParams.Add("p_currencyid", companydetails.currencyid, OracleMappingType.Decimal, ParameterDirection.Input);

                    await connection.ExecuteAsync("company_management.insert_company_detail", oracleParams, commandType: CommandType.StoredProcedure);
                    return companydetails;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

        }

        public async Task<Companydetails> GetCompany(int id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var oracleDynamicParameters = new OracleDynamicParameters();
                    oracleDynamicParameters.Add("id", id, dbType: OracleMappingType.Int32, ParameterDirection.Input);
                    oracleDynamicParameters.Add("OUT_COMPANY", dbType: OracleMappingType.RefCursor, direction: ParameterDirection.Output);

                    var result = await connection.QueryFirstOrDefaultAsync<Companydetails>("getcompany.getcompanybyid", oracleDynamicParameters, commandType: CommandType.StoredProcedure);

                    return result;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public async Task UpdateCompany(Companydetails companydetails)
        {
             try{
                using (var connection = _context.CreateConnection())
                {
                    var oracleParams = new OracleDynamicParameters();
                    oracleParams.Add("p_contact", companydetails.contact, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_companyname", companydetails.companyname, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_companyshortname", companydetails.companyshortname, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_address", companydetails.Address, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_zipcode", companydetails.zipcode, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_active", companydetails.active, OracleMappingType.Varchar2, ParameterDirection.Input);
                    oracleParams.Add("p_cid", companydetails.cid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_sid", companydetails.sid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_cityid", companydetails.cityid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_revenue", companydetails.revenue, OracleMappingType.Decimal, ParameterDirection.Input);
                    oracleParams.Add("p_contactid", companydetails.contactid, OracleMappingType.Int32, ParameterDirection.Input);
                    oracleParams.Add("p_currencyid", companydetails.currencyid, OracleMappingType.Int32, ParameterDirection.Input);


                    await connection.ExecuteAsync("getcompany.update_company", oracleParams, commandType: CommandType.StoredProcedure);
                  
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }



           




        

        public async Task UpdateBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {

                    foreach (var budgetdetailline in budgetdetaillines)
                    {
                        var oracleParams = new OracleDynamicParameters();
                        oracleParams.Add("p_startamount", budgetdetailline.startamount, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_limitamount", budgetdetailline.limitamount, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_manhour", budgetdetailline.manhour, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_containertype", budgetdetailline.containertype, OracleMappingType.Varchar2, ParameterDirection.Input);
                        oracleParams.Add("p_containersize", budgetdetailline.containersize, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_budgetid", budgetdetailline.budgetid, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_budgetdetailid", budgetdetailline.budgetdetailid, OracleMappingType.Int32, ParameterDirection.Input);

                        await connection.ExecuteAsync("manage_budgetdetailline.update_budgetdetailline", oracleParams, commandType: CommandType.StoredProcedure);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
            


            
           
           public async Task InsertBudgetLines(IEnumerable<Budgetdetailline> budgetdetaillines)
            {
                try
                {
                    using (var connection = _context.CreateConnection())
                    {
                        foreach (var budgetdetailline in budgetdetaillines)
                        {
                            var oracleParams = new OracleDynamicParameters();
                            oracleParams.Add("p_startamount", budgetdetailline.startamount, OracleMappingType.Int32, ParameterDirection.Input);
                            oracleParams.Add("p_limitamount", budgetdetailline.limitamount, OracleMappingType.Int32, ParameterDirection.Input);
                            oracleParams.Add("p_manhour", budgetdetailline.manhour, OracleMappingType.Int32, ParameterDirection.Input);
                            oracleParams.Add("p_containertype", budgetdetailline.containertype, OracleMappingType.Varchar2, ParameterDirection.Input);
                            oracleParams.Add("p_containersize", budgetdetailline.containersize, OracleMappingType.Int32, ParameterDirection.Input);
                            oracleParams.Add("p_budgetid", budgetdetailline.budgetid, OracleMappingType.Int32, ParameterDirection.Input);

                            await connection.ExecuteAsync("manage_budgetdetailline.insertbudgetline", oracleParams, commandType: CommandType.StoredProcedure);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
            }


            public async Task<int> InsertBudgetDetail(Budgetdetails budgetDetails)
            {
                try
                {
                    using (var connection = _context.CreateConnection())
                    {
                        var oracleParams = new OracleDynamicParameters();
                        oracleParams.Add("p_description", budgetDetails.description, OracleMappingType.Varchar2, ParameterDirection.Input);
                        oracleParams.Add("p_budgetcurrencyid", budgetDetails.budgetcurrencyid, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_budgetactive", budgetDetails.budgetactive, OracleMappingType.Varchar2, ParameterDirection.Input);
                        oracleParams.Add("p_createdate", budgetDetails.createdate, OracleMappingType.Varchar2, ParameterDirection.Input);
                        oracleParams.Add("p_companyid", budgetDetails.companyid, OracleMappingType.Int32, ParameterDirection.Input);
                        oracleParams.Add("p_budgetid", dbType: OracleMappingType.Int32, direction: ParameterDirection.Output); // Output parameter for the generated budget id

                        await connection.ExecuteAsync("budget_management.insert_budgetdetail", oracleParams, commandType: CommandType.StoredProcedure);

                        int generatedBudgetId = oracleParams.Get<int>("p_budgetid"); // Retrieve the generated budget id from the output parameter
                        return generatedBudgetId;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
            }
      

     public async Task DeleteBudgetDetailLine(int[] ids)
{
    var query = @"DELETE FROM budgetdetailline WHERE budgetdetailid IN :Ids";

    using (var connection = _context.CreateConnection())
    {
        var parameters = new DynamicParameters();
        parameters.Add("Ids", ids);

        await connection.ExecuteAsync(query, parameters);
    }
}





      

       public async Task<IEnumerable<Budgetdetails>> LazyDataBudget(int skip, int take, string? orderby, bool isAsc, string[]? searchfield, string[]? sfieldvalue,string? globalfilter){
        try
        {
        var query = new StringBuilder();
        query.Append(@"SELECT 
                    b.budgetid, b.description, b.budgetcurrencyid,
                    b.budgetactive,
                    cu.currency,
                    b.createdate,
                    c.companyid,
                    COUNT(*) OVER() AS total_records
                FROM 
                    budgetdetail b
                JOIN 
                    currencydetail cu On cu.currencyid = b.budgetcurrencyid
                JOIN 
                    companydetail c ON c.companyid = b.companyid");

        if (searchfield != null && searchfield.Length > 0 && sfieldvalue != null && sfieldvalue.Length > 0)
        {
            query.Append(" WHERE ");
            for (int i = 0; i < searchfield.Length; i++)
            {
                if (i > 0)
                    query.Append(" AND ");
                query.Append($"lower(b.{searchfield[i]}) LIKE lower('%{sfieldvalue[i]}%')");
            }
        }

        if (!string.IsNullOrEmpty(globalfilter))
        {
            query.Append(" AND (");
            query.Append($" lower(b.budgetid) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.description) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.budgetcurrencyid) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.createdate) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(cu.currencyid) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.budgetactive) LIKE lower('%{globalfilter}%')");
            query.Append(")");
        }

        if (!string.IsNullOrEmpty(orderby))
        {
            query.Append($" ORDER BY b.{orderby} {(isAsc ? "ASC" : "DESC")}");
        }

        query.Append($" OFFSET {skip} ROWS FETCH NEXT {take} ROWS ONLY");

        using (var connection = _context.CreateConnection())
        {
            var result = await connection.QueryAsync<Budgetdetails>(query.ToString()).ConfigureAwait(false);
            return result;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("An error occurred: " + ex.Message);
        throw; 
    }
}

        public async Task<IEnumerable<Companydetails>> getShortName()
        {
            var query = @"select cid,sid,cityid,companyshortname,companyid from companydetail";

            using(var connection = _context.CreateConnection()){
                var result = await connection.QueryAsync<Companydetails>(query.ToString());
                return result;
            }
        }

      

        public async Task<IEnumerable<Currencydetails>> GetCurrency()
        {
            var query = @"select * from currencydetail";

            using(var connection = _context.CreateConnection()){
                var result = await connection.QueryAsync<Currencydetails>(query.ToString());
                return result;
            }
        }

       public async Task<IEnumerable<Budgetdetailline>> LazyBudgetDetail(int skip, int take, string? orderby, bool isAsc, string[]? searchfield, string[]? sfieldvalue, string globalfilter, int id)
{
    try
    {
                var query = new StringBuilder();
                query.Append(@"SELECT 
                b.budgetdetailid, b.startamount, b.limitamount,
                b.manhour,
                b.containertype,
                b.containersize,
                b.budgetid,
                COUNT(*) OVER() AS total_records
            FROM 
                budgetdetailline b
            JOIN 
                budgetdetail c ON c.budgetid = b.budgetid");

        query.Append(" WHERE b.budgetid = :BudgetId"); // Add WHERE clause for b.budgetid

        if (searchfield != null && searchfield.Length > 0 && sfieldvalue != null && sfieldvalue.Length > 0)
        {
            query.Append(" AND (");
            for (int i = 0; i < searchfield.Length; i++)
            {
                if (i > 0)
                    query.Append(" AND ");
                query.Append($"lower(b.{searchfield[i]}) LIKE lower('%{sfieldvalue[i]}%')");
            }
            query.Append(")");
        }

        if (!string.IsNullOrEmpty(globalfilter))
        {
            query.Append(" AND (");
            query.Append($" lower(b.startamount) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.limitamount) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.manhour) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.containertype) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.containersize) LIKE lower('%{globalfilter}%') OR ");
            query.Append($" lower(b.containertype) LIKE lower('%{globalfilter}%')");
            query.Append(")");
        }

        if (!string.IsNullOrEmpty(orderby))
        {
            query.Append($" ORDER BY b.{orderby} {(isAsc ? "ASC" : "DESC")}");
        }

        query.Append($" OFFSET {skip} ROWS FETCH NEXT {take} ROWS ONLY");

        using (var connection = _context.CreateConnection())
        {
            var result = await connection.QueryAsync<Budgetdetailline>(query.ToString(), new { BudgetId = id }).ConfigureAwait(false);
            return result;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("An error occurred: " + ex.Message);
        throw;
    }
}

        public async Task<IEnumerable<Companydetails>> getShortNamebyid(int id)
        {
            var query = @"SELECT companyid, companyshortname FROM companydetail WHERE cityid = :Id";

            using (var connection = _context.CreateConnection())
            {
                var result = await connection.QueryAsync<Companydetails>(query, new { Id = id });
                return result;
            }
        }

        
    }
}