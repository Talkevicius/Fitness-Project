namespace backend.Models
{
    public class Exercise
    {
        public int Id { get; set; } // Primary key
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Foreign key to Category
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        // Navigation property: one exercise can have many comments
        public List<Comment>? Comments { get; set; }
    }
}