using FieldServiceAPI.SystemAdmin.Data;
using FieldServiceAPI.SystemAdmin.DTOs.Base;
using FieldServiceAPI.SystemAdmin.DTOs.SystemErrorLogs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using FieldServiceAPI.SystemAdmin.Mappers;
using FieldServiceAPI.Extensions;

namespace FieldServiceAPI.SystemAdmin.Services.SystemErrorLog
{
    public interface ISystemErrorLogQueryService
    {
        Task<SystemPagedResponse<SystemErrorLogResponse>> GetLogsAsync(SystemPagedRequest request, string? tenantSchema = null);
    }

    public class SystemErrorLogQueryService : ISystemErrorLogQueryService
    {
        private readonly SystemDbContext _context;

        public SystemErrorLogQueryService(SystemDbContext context)
        {
            _context = context;
        }

        public async Task<SystemPagedResponse<SystemErrorLogResponse>> GetLogsAsync(SystemPagedRequest request, string? tenantSchema = null)
        {
            var query = _context.SystemErrorLogs.AsQueryable()
                .WhereIf(!string.IsNullOrEmpty(tenantSchema), l => l.TenantSchema == tenantSchema)
                .WhereIf(!string.IsNullOrEmpty(request.Keyword), l => l.ErrorMessage!.Contains(request.Keyword!) || l.TenantSchema!.Contains(request.Keyword!));

            var totalCount = await query.CountAsync();

            query = query.OrderByDynamic(
                string.IsNullOrEmpty(request.SortBy) ? "CreatedAt" : request.SortBy, 
                request.IsDescending ? "desc" : "asc"
            );

            var logs = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(l => l.ToResponse())
                .ToListAsync();

            return new SystemPagedResponse<SystemErrorLogResponse>
            {
                Items = logs,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
