using System;

namespace FieldServiceAPI.SystemAdmin.DTOs.SystemErrorLogs
{
    public class SystemErrorLogResponse
    {
        public int Id { get; set; }
        public string? ErrorMessage { get; set; }
        public string? StackTrace { get; set; }
        public string? TenantSchema { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
