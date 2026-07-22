namespace FieldServiceAPI.Tenant.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public List<string> Permissions { get; set; } = new List<string>();
    }
}
