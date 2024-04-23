using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class Citydetails
    {
        [Key]
        public int cityid {get; set;}

        public string city { get; set;}

        public int sid { get; set;}
        public int cid { get; set;}


    }
}