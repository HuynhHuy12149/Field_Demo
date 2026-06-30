using FieldServiceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Province> Provinces { get; set; }
    }
}
