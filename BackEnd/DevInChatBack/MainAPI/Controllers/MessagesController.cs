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
    public class MessagesController : ControllerBase
    {
        private readonly MainApiContext _context;

        public MessagesController(MainApiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
          if (_context.Messages == null)
          {
              return NotFound();
          }
            var db = _context.Messages;
            var last30Items = db.OrderByDescending(x => x.Id).Take(30).ToList();
            last30Items.Reverse();
            return Ok(last30Items);
        }

        [HttpGet("{keyword}")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessage(string keyword)
        {
            if (_context.Messages == null)
            {
                return NotFound();
            }

            IQueryable<Message> messagesQuery = _context.Messages;

            if (!string.IsNullOrEmpty(keyword))
            {
                messagesQuery = messagesQuery.Where(m => m.Text.Contains(keyword));
            }

            var last30Messages = await messagesQuery
                .OrderByDescending(m => m.Id)
                .Take(30)
                .ToListAsync();

            if (last30Messages == null || !last30Messages.Any())
            {
                return NotFound();
            }
            last30Messages.Reverse();
            return Ok(last30Messages);
        }
    }
}
