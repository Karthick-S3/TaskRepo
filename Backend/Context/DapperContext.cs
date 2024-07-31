using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;


namespace Backend.Context
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly String _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DapConnection");


        }


        // public object Database { get; internal set; }

        public IDbConnection CreateConnection() => new OracleConnection(_connectionString);
    }
}