using BackEnd_Todo.Data;
using BackEnd_Todo.DtoModel;
using BackEnd_Todo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackEnd_Todo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> Todos(int page = 1, int pageSize = 25)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 25;

            var totalCount = await _context.Todos.CountAsync();

            var todos = await _context.Todos
                .Where(i => i.UserId == userId)
                .OrderBy(t => t.Id) // مهم للترتيب الصحيح
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Items = todos
            };

            return Ok(result);
        }


        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> CreateTodo(dtoToDo todoDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var todo = new Todo
            {
                Title = todoDto.Title,
                Description = todoDto.description ?? string.Empty, // Ensure Description is not null
                UserId = userId
            };

            await _context.Todos.AddAsync(todo);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Todo created successfully",
                Todo = todoDto
            });
        }

        [HttpPut("[action]/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTodo(int id, dtoToDo todoDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null || todo.UserId != userId)
            {
                return NotFound("Todo not found or you do not have permission to update it.");
            }
            todo.Title = todoDto.Title;
            todo.Description = todoDto.description; // Ensure Description is not null
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Todo updated successfully",
                Todo = todoDto
            });
        }

        [HttpDelete("[action]/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null || todo.UserId != userId)
            {
                return NotFound("Todo not found or you do not have permission to delete it.");
            }
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Todo deleted successfully"
            });
        }

    }
}
