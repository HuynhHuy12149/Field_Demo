using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceAPI.SystemAdmin.Entities
{
    public enum TenantStatus
    {
        Active = 1,
        Suspended = 2,
        Deleted = 3
    }

    public enum TenantType
    {
        Field = 1,
        Class = 2,
        ERP = 3
    }

    [Table("Tenants", Schema = "public")]
    public class Tenant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string SchemaName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string AdminEmail { get; set; } = string.Empty;

        public TenantStatus Status { get; set; } = TenantStatus.Active;

        public TenantType Type { get; set; } = TenantType.Field;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
