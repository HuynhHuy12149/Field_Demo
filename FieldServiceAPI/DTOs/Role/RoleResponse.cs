namespace FieldServiceAPI.DTOs.Role
{
    public class RoleResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
