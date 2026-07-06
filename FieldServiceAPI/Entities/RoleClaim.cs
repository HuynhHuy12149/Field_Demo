using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceAPI.Entities
{
    public class RoleClaim : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; } = default!;

        public string ClaimType { get; set; } = default!;
        public string ClaimValue { get; set; } = default!;
    }
}
