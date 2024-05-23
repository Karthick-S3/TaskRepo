using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class filesdetails
    {
        [Key]
        public int fid { get; set; }

        public string originalname { get; set; }

        public string storedname { get; set; }

        public long filesize { get; set; }

        public DateTime uploaddate { get; set; }

        public int companyid { get; set; }
    }
}