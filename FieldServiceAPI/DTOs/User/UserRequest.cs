using System.ComponentModel.DataAnnotations;

namespace FieldServiceAPI.DTOs.Users
{
    public class UserRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập Họ tên")]
        public string FullName { get; set; } = default!;

        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = default!;

        public string? Phone { get; set; }
        
        public string? Address { get; set; }

        public string? Password { get; set; }

        public string? AvatarUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public List<int> RoleIds { get; set; } = new List<int>();
    }
}
