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



        



       

        





        



           



        public async Task<IEnumerable<Companydetails>> LazyData2(int skip, int take, string? orderby, bool isAsc, string[]? searchfield, string[]? sfieldvalue, int[]? countries, int[]? states, int[]? cities)
{
    try
    {
        var query = new StringBuilder();
        query.Append(@"SELECT 
                        cd.companyid, cd.companyname, con.contact, cd.companyshortname,
                        cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
                        cd.establish_date, cd.REVENUE,
                        COUNT(*) OVER() AS total_records
                        FROM 
                            companydetail cd
                        JOIN 
                            countrydetail co ON co.cid = cd.cid
                        JOIN 
                            statedetail st ON st.sid = cd.sid
                        JOIN 
                            citydetail ci ON ci.cityid = cd.cityid
                        JOIN 
                            contactdetail con ON con.contactid = cd.contactid");

                        if (searchfield != null && searchfield.Length > 0 && sfieldvalue != null && sfieldvalue.Length > 0)
                        {
                            query.Append(" WHERE ");
                            for (int i = 0; i < searchfield.Length; i++)
                            {
                                if (i > 0)
                                    query.Append(" AND ");
                                query.Append($"lower({searchfield[i]}) LIKE lower('%{sfieldvalue[i]}%')");
                            }
                        }

                        if (countries != null && countries.Any())
                        {
                            query.Append($" AND co.cid IN ({string.Join(",", countries)})");
                        }

                        if (states != null && states.Any())
                        {
                            query.Append($" AND st.sid IN ({string.Join(",", states)})");
                        }

                        if (cities != null && cities.Any())
                        {
                            query.Append($" AND ci.cityid IN ({string.Join(",", cities)})");
                        }


                        if (!string.IsNullOrEmpty(orderby))
                        {
                            query.Append($" ORDER BY {orderby} {(isAsc ? "ASC" : "DESC")}");
                        }
                        else{
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


                    await connection.ExecuteAsync("getcompany.update_company", oracleParams, commandType: CommandType.StoredProcedure);
                  
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
    }
}