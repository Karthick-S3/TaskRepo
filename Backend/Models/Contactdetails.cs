using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Contactdetails
    {
        [Key]
        public int contactid {get; set;}
        public string contact {get; set;}
        public int companyid {get; set;}
    }
}