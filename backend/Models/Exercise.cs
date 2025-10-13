using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Exercise
    {
        public int Id { get; set; } // Primary key
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;

        // Foreign key to Category
        [Required]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        // Navigation property: one exercise can have many comments
        public List<Comment>? Comments { get; set; }
    }
}