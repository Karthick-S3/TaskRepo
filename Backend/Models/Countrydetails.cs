using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Countrydetails
    {
        [Key]
        public int cid {get; set;}

        public string country {get; set;} 
    }
}