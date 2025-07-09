using System.ComponentModel.DataAnnotations;

namespace BackEnd_Todo.DtoModel
{
    public class dtoToDo
    {
        [Required]
        public string? Title { get; set; }

        public string? description { get; set; }
    }
}
