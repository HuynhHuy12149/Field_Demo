using System;
using System.Threading.Tasks;
using FieldServiceAPI.Data;
using FieldServiceAPI.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace FieldServiceAPI.Services.Common
{
    public class SystemErrorLogService
    {
        private readonly IServiceProvider _serviceProvider;

        public SystemErrorLogService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task LogErrorAsync(Exception ex, string? additionalInfo = null)
        {
            try 
            {
                var errorLog = new SystemErrorLog
                {
                    ErrorMessage = additionalInfo != null ? $"{additionalInfo} | {ex.Message}" : ex.Message,
                    StackTrace = ex.StackTrace,
                    CreatedAt = DateTime.UtcNow
                };
                
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
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
