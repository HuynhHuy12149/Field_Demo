using System;
using System.Threading.Tasks;
using FieldServiceAPI.SystemAdmin.Data;
using FieldServiceAPI.SystemAdmin.Entities;
using FieldServiceAPI.SystemAdmin.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FieldServiceAPI.Tenant.Services.Common
{
    public class SystemErrorLogService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ITenantService _tenantService;

        public SystemErrorLogService(IServiceProvider serviceProvider, ITenantService tenantService)
        {
            _serviceProvider = serviceProvider;
            _tenantService = tenantService;
        }

        public async Task LogErrorAsync(Exception ex, string? additionalInfo = null)
        {
            try 
            {
                var errorLog = new SystemErrorLog
                {
                    ErrorMessage = additionalInfo != null ? $"{additionalInfo} | {ex.Message}" : ex.Message,
                    StackTrace = ex.StackTrace,
                    TenantSchema = _tenantService.GetCurrentTenantSchema() ?? "System",
                    CreatedAt = DateTime.UtcNow
                };
                
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<SystemDbContext>();
                context.SystemErrorLogs.Add(errorLog);
                await context.SaveChangesAsync();
            }
            catch 
            {
                // Ignore errors during logging to prevent infinite loops or crashing the main flow
            }
        }
    }
}
