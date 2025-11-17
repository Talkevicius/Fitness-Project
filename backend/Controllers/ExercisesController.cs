using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Text.Json;

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
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            var exercise = await _context.Exercises
                .Include(e => e.Category)
                .Include(e => e.Comments)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return NotFound();

            return Ok(exercise);
        }

        // POST: api/exercises
        [HttpPost]
        public async Task<ActionResult<Exercise>> CreateExercise(Exercise exercise)
        {
            // duplicates
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
        public async Task<IActionResult> UpdateExercise(int id, Exercise updatedExercise)
        {
            if (id != updatedExercise.Id)
                return BadRequest();

            var exercise = await _context.Exercises.FindAsync(id);
            if  (exercise == null)
                return NotFound();

            exercise.Name = updatedExercise.Name;
            exercise.Description = updatedExercise.Description;
            exercise.CategoryId = updatedExercise.CategoryId;

            await _context.SaveChangesAsync();
            return Ok( exercise); 
        }

        // PATCH: api/exercises/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchExercise(int id, [FromBody] JsonElement patchDoc)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound();

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
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound();

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        // GET: api/categories/{categoryId}/exercises/{exerciseId}/comments
        /*[HttpGet("/api/categories/{categoryId}/exercises/{exerciseId}/comments")]
        public async Task<IActionResult> GetCommentsForExercise(int categoryId, int exerciseId)
        {
            var exercise = await _context.Exercises
                .Include(e => e.Comments)
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.CategoryId == categoryId);

            if (exercise == null)
                return NotFound("Exercise not found in this category.");

            return Ok(exercise.Comments);
        }*/

    }
}
