namespace FieldServiceAPI.Tenant.DTOs.Users
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; }
        public List<int> RoleIds { get; set; } = new List<int>();
    }
}
