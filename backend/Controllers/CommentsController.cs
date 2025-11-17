using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: http://localhost:5214/api/comments?pageNumber=1&pageSize=10
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var comments = await _context.Comments
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(c => c.Exercise) // optional,
                .ToListAsync();

            return Ok(comments);
        }

        // GET: api/comments/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.Exercise) // optional
                .ThenInclude(e=>e.Category)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
                return NotFound();

            return Ok(comment);
        }

        // POST: api/comments
        [HttpPost]
        [Authorize] // must be logged in
        public async Task<ActionResult<Comment>> CreateComment(Comment incomingComment)
        {
            // Get user ID from JWT
            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            // Validate exercise exists
            var exerciseExists = await _context.Exercises.AnyAsync(e => e.Id == incomingComment.ExerciseId);
            if (!exerciseExists)
                return BadRequest(new { message = "Exercise does not exist." });

            // Create comment with real user ID
            var comment = new Comment
            {
                Content = incomingComment.Content,
                ExerciseId = incomingComment.ExerciseId,
                UserId = currentUserId
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }


        // PUT: api/comments/{id}
        [HttpPut("{id}")]
        [Authorize] // must be logged in
        public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
        {
            // Check ID mismatch
            if (id != updatedComment.Id)
                return BadRequest("ID mismatch");

            // Find comment
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            // Get logged-in user info
            var userIdClaim = User.FindFirst("id")?.Value;
            var userRole = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            // Verify permissions:
            // Owner OR admin may update
            bool isOwner = comment.UserId == currentUserId;
            bool isAdmin = userRole == "admin";

            if (!isOwner && !isAdmin)
                return Forbid(); // 403 Forbidden

            // === Update ONLY allowed fields ===
            comment.Content = updatedComment.Content;

            // ExerciseId should NOT be changed through update
            // UserId also should NEVER change

            await _context.SaveChangesAsync();

            return Ok(comment);
        }


        // PATCH: api/comments/{id}
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> PatchComment(int id, [FromBody] JsonElement patchDoc)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            // Get user info from JWT
            var userIdClaim = User.FindFirst("id")?.Value;
            var userRole = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            bool isOwner = comment.UserId == currentUserId;
            bool isAdmin = userRole == "admin";

            if (!isOwner && !isAdmin)
                return Forbid(); // 403 Forbidden

            // Apply patch
            foreach (var prop in patchDoc.EnumerateObject())
            {
                switch (prop.Name.ToLower())
                {
                    case "content":
                        comment.Content = prop.Value.GetString() ?? comment.Content;
                        break;

                    // User cannot change exerciseId or userId
                    case "exerciseid":
                    case "userid":
                        return BadRequest("You cannot modify ExerciseId or UserId.");
                }
            }

            await _context.SaveChangesAsync();
            return Ok(comment);
        }



        // DELETE: api/comments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            // Extract user from JWT
            var userIdClaim = User.FindFirst("id")?.Value;
            var userRole = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            bool isOwner = comment.UserId == currentUserId;
            bool isAdmin = userRole == "admin";

            // Only admin or owner can delete
            if (!isOwner && !isAdmin)
                return Forbid(); // 403 Forbidden

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        // GET: api/categories/{categoryId}/exercises/{exerciseId}/comments[HttpGet("/api/categories/{categoryId}/exercises/{exerciseId}/comments")]
        // example: api/categories/1/exercises/1/comments
        [HttpGet("/api/categories/{categoryId}/exercises/{exerciseId}/comments")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsForExercise(
            int categoryId,
            int exerciseId)
        {
            // Optional: validate that the category and exercise exist
            var exerciseExists = await _context.Exercises
                .AnyAsync(e => e.Id == exerciseId && e.CategoryId == categoryId);

            if (!exerciseExists)
                return NotFound("Exercise not found in this category.");

            var comments = await _context.Comments
                .Where(c => c.ExerciseId == exerciseId)
                .ToListAsync();

            return Ok(comments);
        }




    }
}
