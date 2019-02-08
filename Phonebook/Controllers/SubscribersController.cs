using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Phonebook.Models;

namespace Phonebook.Controllers
{
    [Route("api/[controller]")]//, Produces("application/json")]
    [ApiController]
    public class SubscribersController : Controller
    {
        private readonly PhoneDbContext _context;

        public SubscribersController(PhoneDbContext context)
        {
            _context = context;
        }

        // GET: api/subscribers
        [HttpGet]
        public IEnumerable<Subsriber> GetSubsribers()
        {
            return _context.Subsribers;
        }

        // GET: api/subscribers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubsriber([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subsriber = await _context.Subsribers.FindAsync(id);

            if (subsriber == null)
            {
                return NotFound();
            }

            return Ok(subsriber);
        }

        // PUT: api/subscribers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubsriber([FromRoute] int id, [FromBody] Subsriber subsriber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != subsriber.Id)
            {
                return BadRequest();
            }

            _context.Entry(subsriber).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubsriberExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/subscribers
        [HttpPost]
        public async Task<IActionResult> PostSubsriber([FromBody] Subsriber subsriber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Subsribers.Add(subsriber);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubsriber", new { id = subsriber.Id }, subsriber);
        }

        // DELETE: api/subscribers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubsriber([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subsriber = await _context.Subsribers.FindAsync(id);
            if (subsriber == null)
            {
                return NotFound();
            }

            _context.Subsribers.Remove(subsriber);
            await _context.SaveChangesAsync();

            return Ok(subsriber);
        }

        private bool SubsriberExists(int id)
        {
            return _context.Subsribers.Any(e => e.Id == id);
        }
    }
}