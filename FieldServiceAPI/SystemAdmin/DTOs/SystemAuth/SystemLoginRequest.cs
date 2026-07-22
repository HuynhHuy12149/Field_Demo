namespace FieldServiceAPI.SystemAdmin.DTOs.SystemAuth
{
    public class SystemLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
