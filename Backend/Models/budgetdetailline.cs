using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class budgetdetailline
    {
        public int budgetdetailid { get; set; }

        public int startamount {get; set; }

        public int limitamount {get; set; } 

        public int manhour {get; set; }

        public string containertype {get; set; }

        public int containersize {get; set; }   

        public int budgetid {get; set; }

         public int total_records {get; set;}
    }
}