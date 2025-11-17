namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }           // Maps to 'id' column (PK)
        public string Username { get; set; }  // Maps to 'username'
        public string? Email { get; set; }     // Maps to 'email'
        public string Password { get; set; } // Maps to 'password'
        public string? Role { get; set; }      // Maps to 'role'
    }
}