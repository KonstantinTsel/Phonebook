using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Phonebook.Models
{
    public class PhoneDbContext : DbContext
    {
        public PhoneDbContext(DbContextOptions<PhoneDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Subsriber> Subsribers { get; set; }
    }
}
