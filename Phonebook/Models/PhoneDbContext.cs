using Microsoft.EntityFrameworkCore;

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
