using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace FieldServiceAPI.SystemAdmin.Services
{
    public interface ITenantService
    {
        string? GetCurrentTenantSchema();
        void SetCurrentTenantSchema(string schemaName);
    }

    public class TenantService : ITenantService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string? _forcedSchemaName;

        public TenantService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetCurrentTenantSchema()
        {
            // Nếu được set thủ công (khi chạy migration hoặc script)
            if (!string.IsNullOrEmpty(_forcedSchemaName))
            {
                return _forcedSchemaName;
            }

            // Nếu không, lấy từ HTTP Request
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null) return null;

            // Cách 1: Ưu tiên lấy từ JWT Claim (X-Tenant-Schema) nếu có đăng nhập
            var schemaClaim = httpContext.User.FindFirst("TenantSchema")?.Value;
            if (!string.IsNullOrEmpty(schemaClaim))
            {
                return schemaClaim;
            }

            // Cách 2: Lấy từ Header (trước khi đăng nhập, ví dụ gọi login API của tenant)
            if (httpContext.Request.Headers.TryGetValue("X-Tenant-Schema", out var tenantSchema))
            {
                return tenantSchema.FirstOrDefault();
            }

            return null;
        }

        public void SetCurrentTenantSchema(string schemaName)
        {
            _forcedSchemaName = schemaName;
        }
    }
}
