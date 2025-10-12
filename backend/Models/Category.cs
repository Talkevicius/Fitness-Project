namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; } // Primary key
        public string MuscleGroup { get; set; } = string.Empty;

        // Navigation property: one category has many exercises
        public List<Exercise>? Exercises { get; set; }
    }
}