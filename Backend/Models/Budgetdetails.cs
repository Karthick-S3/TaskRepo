using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Budgetdetails
    {
        [Key]
        public int Budgetid { get; set;}

        public string description {get; set;}

        public int budgetcurrencyid { get; set;}

        public string budgetactive { get; set;}
        public DateTime createdate { get; set;}
        public int companyid { get; set;}


        public string currency { get; set;}

        public int total_records {get; set;}
    }
}