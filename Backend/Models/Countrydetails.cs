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
        public int cid { get; set; }

        public string country { get; set; }

        public string Key { get; set; }
        public string Label { get; set; }
        public string Data { get; set; }
        public string Icon { get; set; }

        public List<Statedetails> States { get; set; }

       public class Statedetails{
            public int cid { get; set;}
            public int sid { get; set;}
            public string state { get; set; }
            public string Key { get; set; }
            public string Label { get; set; }
            public string Data { get; set; }
            public string Icon { get; set; }
        }

    }
     
}