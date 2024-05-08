using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Statedetails
    {
        [Key]
        public int sid {get; set;}

        public string state {get; set;}

        public int cid {get; set;}
    }
}