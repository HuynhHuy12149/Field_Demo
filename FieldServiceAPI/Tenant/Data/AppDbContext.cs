using FieldServiceAPI.Tenant.Entities;
using FieldServiceAPI.Tenant.Services.Common;
using FieldServiceAPI.SystemAdmin.Services;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace FieldServiceAPI.Tenant.Data
{
    public class AppDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ITenantService _tenantService;
        
        public string? CurrentSchema => _tenantService.GetCurrentTenantSchema();

        public AppDbContext(
            DbContextOptions<AppDbContext> options, 
            ICurrentUserService currentUserService,
            ITenantService tenantService) : base(options) 
        { 
            _currentUserService = currentUserService;
            _tenantService = tenantService;
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RoleClaim> RoleClaims { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Remove HasDefaultSchema. We will use Npgsql SearchPath in the connection string instead.

            // Composite Key for UserRole
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Global Query Filters (Soft Delete)
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Role>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<UserRole>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<RoleClaim>().HasQueryFilter(e => !e.IsDeleted);
        }
        public override int SaveChanges()
        {
            ApplyAuditLogic();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditLogic();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditLogic()
        {
            ChangeTracker.DetectChanges();
            var currentUser = _currentUserService?.Email ?? "System";

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.CreatedBy = currentUser;
                        entry.Entity.IsDeleted = false;
                        break;
                    
                    case EntityState.Modified:
                        var isDeletedProp = entry.Property(nameof(BaseEntity.IsDeleted));
                        // Nếu đối tượng bị xóa mềm (IsDeleted = true) và IsDeleted vừa được thay đổi
                        if (isDeletedProp.IsModified && entry.Entity.IsDeleted)
                        {
                            entry.Entity.DeletedAt = DateTime.UtcNow;
                            entry.Entity.DeletedBy = currentUser;
                        }
                        else
                        {
                            entry.Entity.UpdatedAt = DateTime.UtcNow;
                            entry.Entity.UpdatedBy = currentUser;
                        }
                        break;

                    case EntityState.Deleted:
                        // Tự động chuyển đổi thành Soft Delete
                        entry.State = EntityState.Modified;
                        entry.Entity.IsDeleted = true;
                        entry.Entity.DeletedAt = DateTime.UtcNow;
                        entry.Entity.DeletedBy = currentUser;
                        break;
                }
            }
        }
    }
}
