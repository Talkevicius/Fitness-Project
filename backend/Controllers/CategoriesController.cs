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
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories?pageNumber=1&pageSize=10
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var total = await _context.Categories.CountAsync();

            var categories = await _context.Categories
                //.Include(c => c.Exercises)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = total,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = categories
            });
        }

        // GET: api/categories/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Exercises) // include related exercises if needed
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // POST: api/categories
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            // Duplicate check on MuscleGroup
            var exists = await _context.Categories
                .AnyAsync(c => c.MuscleGroup.ToLower() == category.MuscleGroup.ToLower());

            if (exists)
                return Conflict(new { message = "A category with the same muscle group already exists." });

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/categories/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateCategory(int id, Category updatedCategory)
        {
            if (id != updatedCategory.Id)
                return BadRequest();

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.MuscleGroup = updatedCategory.MuscleGroup;

            await _context.SaveChangesAsync();
            return Ok(category);
        }
        
        // PATCH: api/categories/{id}
        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PatchCategory(int id, [FromBody] JsonElement patchData)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            if (patchData.TryGetProperty("muscleGroup", out JsonElement muscleGroupElement))
            {
                string newMuscleGroup = muscleGroupElement.GetString();
                if (string.IsNullOrWhiteSpace(newMuscleGroup))
                    return BadRequest("MuscleGroup cannot be empty.");

                category.MuscleGroup = newMuscleGroup;
            }

            await _context.SaveChangesAsync();
            return Ok(category); 
        }

        
        // DELETE: api/categories/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
