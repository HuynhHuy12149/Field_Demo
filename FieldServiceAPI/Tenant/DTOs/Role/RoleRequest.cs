using System.ComponentModel.DataAnnotations;

namespace FieldServiceAPI.Tenant.DTOs.Role
{
    public class RoleRequest
    {
        [Required(ErrorMessage = "Tên nhóm quyền là bắt buộc")]
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
