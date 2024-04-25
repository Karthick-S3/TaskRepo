using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Companydetails
    {

        [Key]
        public int companyid {get; set;}

        public string companyname {get; set;}

        public string companyshortname {get; set;}

        public string Address {get; set;}

        public int zipcode {get; set;}

        public string active {get; set;}

        public string contact {get; set;}

        public string country {get; set;}
        public int cid {get; set;}

        public string state {get; set;}
        public int sid {get; set;}

        public string city {get; set;}
        public int cityid {get; set;}

        public DateTime establish_date {get; set;}

        public decimal revenue {get; set;}

        public int total_records {get; set;}

        public int contactid {get; set;}

        internal async Task<List<Companydetails>> ToList()
        {
            throw new NotImplementedException();
        }
    }
}