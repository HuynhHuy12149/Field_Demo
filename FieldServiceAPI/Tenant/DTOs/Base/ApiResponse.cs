namespace FieldServiceAPI.Tenant.DTOs.Base
{
    public class ApiResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
    }
}
