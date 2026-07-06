using System;
using System.Threading.Tasks;
using FieldServiceAPI.Data;
using FieldServiceAPI.Entities;

namespace FieldServiceAPI.Services.Common
{
    public class SystemErrorLogService
    {
        private readonly AppDbContext _context;

        public SystemErrorLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogErrorAsync(Exception ex, string? additionalInfo = null)
        {
            var errorLog = new SystemErrorLog
            {
                ErrorMessage = additionalInfo != null ? $"{additionalInfo} | {ex.Message}" : ex.Message,
                StackTrace = ex.StackTrace,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.SystemErrorLogs.Add(errorLog);
            await _context.SaveChangesAsync();
        }
    }
}
