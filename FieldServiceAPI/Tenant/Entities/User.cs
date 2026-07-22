using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceAPI.Tenant.Entities
{
    public class User : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string PasswordHash { get; set; } = default!;
        public string? AvatarUrl { get; set; }
        public bool IsSuperAdmin { get; set; } = false;
        public bool IsActive { get; set; } = true;

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
