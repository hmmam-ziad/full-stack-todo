﻿using System.ComponentModel.DataAnnotations;

namespace BackEnd_Todo.DtoModel
{
    public class dtoNewUser
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
