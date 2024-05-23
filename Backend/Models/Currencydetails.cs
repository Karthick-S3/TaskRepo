using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Currencydetails
    {
        
        [Key]
        public int currencyid {get; set;}

        public string currency {get; set;}
    }
}