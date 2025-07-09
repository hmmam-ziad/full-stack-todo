using System.ComponentModel.DataAnnotations;

namespace BackEnd_Todo.DtoModel
{
    public class dtoUser
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string password { get; set; }
    }
}
