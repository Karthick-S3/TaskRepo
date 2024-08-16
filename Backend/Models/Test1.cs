using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Test1
    {
        [Key]
        public int id { get; set; }
        public string firstname {get; set; }
        public string lastname {get; set; }
    }
}