using FieldServiceAPI.SystemAdmin.Entities;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.SystemAdmin.Data
{
    public class SystemDbContext : DbContext
    {
        public SystemDbContext(DbContextOptions<SystemDbContext> options) : base(options)
        {
        }

        public DbSet<SystemAdmin.Entities.Tenant> Tenants { get; set; }
        public DbSet<SystemUser> SystemUsers { get; set; }
        public DbSet<SystemErrorLog> SystemErrorLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Set default schema for system tables
            modelBuilder.HasDefaultSchema("public");
            
            // Khởi tạo một tài khoản Super Admin mặc định
            modelBuilder.Entity<SystemUser>().HasData(new SystemUser
            {
                Id = 1,
                FullName = "Super Admin",
                Email = "superadmin@gmail.com",
                // Hardcoded hash for "Admin@123"
                PasswordHash = "$2a$11$auPbtJiBd77yD9xrH65jwO1HSE.BpYd7GhE8CE9qlgqKK.NdDgLqW", 
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }
    }
}
