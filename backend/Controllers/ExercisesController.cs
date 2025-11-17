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
    public class ExercisesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExercisesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/exercises?pageNumber=1&pageSize=10
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetExercises([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var total = await _context.Exercises.CountAsync();

            var exercises = await _context.Exercises
                .Include(e => e.Category)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = total,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = exercises
            });
        }

        // GET: api/exercises/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            var exercise = await _context.Exercises
                .Include(e => e.Category)
                .Include(e => e.Comments)
                //.Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return NotFound();

            return Ok(exercise);
        }

        // POST: api/exercises
        [HttpPost]
        [Authorize] // allow both users and admins
        public async Task<ActionResult<Exercise>> CreateExercise(Exercise exercise)
        {
            // Assign the creator's UserId from JWT
            var userId = int.Parse(User.FindFirst("id")!.Value);
            exercise.UserId = userId;

            // Check duplicates
            var exists = await _context.Exercises
                .AnyAsync(e => e.Name.ToLower() == exercise.Name.ToLower()
                               && e.CategoryId == exercise.CategoryId);

            if (exists)
                return Conflict(new { message = "An exercise with the same name already exists in this category." });

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExercise), new { id = exercise.Id }, exercise);
        }



        // PUT: api/exercises/{id}
        [HttpPut("{id}")]
        [Authorize] // Any logged-in user
        public async Task<IActionResult> UpdateExercise(int id, Exercise updatedExercise)
        {
            if (id != updatedExercise.Id)
                return BadRequest();

            // Fetch the exercise along with the creator info
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound();

            // Get the current logged-in user's ID and role from JWT claims
            var userIdClaim = User.FindFirst("id")?.Value;
            var roleClaim = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            // Only allow update if the user is the creator or an admin
            if (exercise.UserId != currentUserId && roleClaim != "admin")
                return Forbid(); // 403 Forbidden

            // Update fields
            exercise.Name = updatedExercise.Name;
            exercise.Description = updatedExercise.Description;
            exercise.CategoryId = updatedExercise.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(exercise);
        }


        // PATCH: api/exercises/{id}
        [HttpPatch("{id}")]
        [Authorize] // Only logged-in users
        public async Task<IActionResult> PatchExercise(int id, [FromBody] JsonElement patchDoc)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound();

            // Get current user info from JWT
            var userIdClaim = User.FindFirst("id")?.Value;
            var roleClaim = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            // Only allow patch if the user is the creator or admin
            if (exercise.UserId != currentUserId && roleClaim != "admin")
                return Forbid(); // 403 Forbidden

            // Apply changes
            foreach (var prop in patchDoc.EnumerateObject())
            {
                switch (prop.Name.ToLower())
                {
                    case "name":
                        exercise.Name = prop.Value.GetString() ?? exercise.Name;
                        break;
                    case "description":
                        exercise.Description = prop.Value.GetString() ?? exercise.Description;
                        break;
                    case "categoryid":
                        if (prop.Value.TryGetInt32(out int catId))
                            exercise.CategoryId = catId;
                        break;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(exercise);
        }


        // DELETE: api/exercises/{id}
        [HttpDelete("{id}")]
        [Authorize] // Only logged-in users
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound();

            // Get current user info from JWT
            var userIdClaim = User.FindFirst("id")?.Value;
            var roleClaim = User.FindFirst("role")?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int currentUserId = int.Parse(userIdClaim);

            // Only allow deletion if the user is the creator or admin
            if (exercise.UserId != currentUserId && roleClaim != "admin")
                return Forbid(); // 403 Forbidden

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        

    }
}
