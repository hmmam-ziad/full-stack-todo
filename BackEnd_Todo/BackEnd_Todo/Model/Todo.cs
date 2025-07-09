using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_Todo.Model
{
    public class Todo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }

        [Required]
        public string? Description { get; set; }
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }

        //Navigation 
        public AppUser? User { get; set; }
    }
}
