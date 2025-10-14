using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Comment
    {
        public int Id { get; set; } // Primary key
        [Required]
        public string Content { get; set; } = string.Empty;

        // Foreign key to Exercise
        [Required]
        public int? ExerciseId { get; set; }
        public Exercise? Exercise { get; set; }

        // Foreign key to User implement later
        //public int UserId { get; set; }
        //public User? User { get; set; }
    }
}