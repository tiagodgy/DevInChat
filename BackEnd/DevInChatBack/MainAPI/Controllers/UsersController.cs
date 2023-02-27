using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MainApi.Context;
using MainApi.Models;

namespace MainApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MainApiContext _context;

        public UsersController(MainApiContext context)
        {
            _context = context;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<bool>> CheckUsernameExists(string username)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }

            var userExists = await _context.Users.AnyAsync(u => u.Name == username);

            return userExists;
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.Users == null)
          {
              return Problem("Entity set 'MainApiContext.Users'  is null.");
          }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }
    }
}
