namespace FieldServiceAPI.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
    }
}
