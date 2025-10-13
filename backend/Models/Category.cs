using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; } // Primary key
        
        [Required]
        public string MuscleGroup { get; set; } = string.Empty;

        // Navigation property: one category has many exercises
        public List<Exercise>? Exercises { get; set; }
    }
}