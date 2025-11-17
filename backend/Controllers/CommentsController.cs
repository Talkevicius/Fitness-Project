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
        public async Task<ActionResult<Comment>> CreateComment(Comment comment)
        {
            // Optionally validate ExerciseId exists here

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }

        // PUT: api/comments/5 (Full update)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
        {
            if (id != updatedComment.Id)
                return BadRequest("ID mismatch");

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            // Update all properties
            comment.Content = updatedComment.Content;
            comment.ExerciseId = updatedComment.ExerciseId;

            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        // PATCH: api/comments/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchComment(int id, [FromBody] JsonElement patchDoc)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            foreach (var prop in patchDoc.EnumerateObject())
            {
                switch (prop.Name.ToLower())
                {
                    case "content":
                        comment.Content = prop.Value.GetString() ?? comment.Content;
                        break;

                    case "exerciseid":
                        if (prop.Value.TryGetInt32(out int exerciseId))
                            comment.ExerciseId = exerciseId;
                        break;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(comment);
        }


        // DELETE: api/comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // GET: api/categories/{categoryId}/exercises/{exerciseId}/comments[HttpGet("/api/categories/{categoryId}/exercises/{exerciseId}/comments")]
        // example: api/categories/1/exercises/1/comments
        [HttpGet("/api/categories/{categoryId}/exercises/{exerciseId}/comments")]
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
