using BackEnd_Todo.Data;
using BackEnd_Todo.DtoModel;
using BackEnd_Todo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackEnd_Todo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AccountController(UserManager<AppUser> userManager, IConfiguration config, AppDbContext context)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register(dtoNewUser newUser)
        {
            if (ModelState.IsValid) {
                if(await _userManager.FindByNameAsync(newUser.Username) != null || await _userManager.FindByEmailAsync(newUser.Email) != null)
                {
                    return BadRequest("Email or Username already exists");
                }
                AppUser user = new AppUser
                {
                    UserName = newUser.Username,
                    Email = newUser.Email
                };
                
                IdentityResult result = await _userManager.CreateAsync(user, newUser.Password);
                if (result.Succeeded) {
                    var claims = new List<Claim>();
                    claims.Add(new Claim(ClaimTypes.Name, user.UserName));
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                    claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SecretKey"]));
                    var SignIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        claims: claims,
                        issuer: _config["JWT:Issuer"],
                        audience: _config["JWT:Audience"],
                        expires: DateTime.UtcNow.AddMinutes(30),
                        signingCredentials: SignIn
                        );
                    var _token = new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        exception = token.ValidTo
                    };
                    return Ok(new
                    {
                        Username = user.UserName,
                        Email = user.Email,
                        Token = _token
                    });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(dtoUser dtoUser)
        {
            if (ModelState.IsValid)
            {
                AppUser? user = await _userManager.FindByNameAsync(dtoUser.username);
                if (user != null) { 
                    if(await _userManager.CheckPasswordAsync(user, dtoUser.password))
                    {
                        var claims = new List<Claim>();
                        claims.Add(new Claim(ClaimTypes.Name, user.UserName));
                        claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SecretKey"]));
                        var SignIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                        var token = new JwtSecurityToken(
                            claims: claims,
                            issuer: _config["JWT:Issuer"],
                            audience: _config["JWT:Audience"],
                            expires: DateTime.UtcNow.AddHours(5),
                            signingCredentials: SignIn
                            );
                        var _token = new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            exception = token.ValidTo
                        };
                        return Ok(new
                        {
                            Username = user.UserName,
                            Token = _token
                        });
                    }
                    else
                    {
                        return Unauthorized();
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Invalid user name or password");
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return NotFound($"The user ID {userId} does not exist");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var todos = await _context.Todos
                .Where(t => t.UserId == userId)
                .Select(t => new {
                    t.Id,
                    t.Title,
                    t.Description
                })
                .ToListAsync();

            var userDto = new
            {
                user.UserName,
                user.Email,
                Todos = todos
            };

            return Ok(userDto);
        }

    }
}
