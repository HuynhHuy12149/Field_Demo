using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.Tenant.DTOs.Base;
using FieldServiceAPI.Tenant.Entities;
using FieldServiceAPI.SystemAdmin.Data;
using FieldServiceAPI.SystemAdmin.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Microsoft.Extensions.DependencyInjection;
using FieldServiceAPI.Tenant.Services.Common;
using FieldServiceAPI.Extensions;

namespace FieldServiceAPI.SystemAdmin.Services
{
    public interface ISystemTenantService
    {
        Task<PagedResponse> GetTenantsAsync(PagedRequest request);
        Task<ApiResponse> CreateTenantAsync(CreateTenantRequest request);
        Task<ApiResponse> UpdateStatusAsync(int id, TenantStatus status);
        Task<ApiResponse> DeleteTenantAsync(int id);
        Task<ApiResponse> ChangeTenantAdminPasswordAsync(int id, string newPassword);
    }

    public class CreateTenantRequest
    {
        public string Name { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
        public string AdminFullName { get; set; } = string.Empty;
        public TenantType Type { get; set; }
    }

    public class SystemTenantService : ISystemTenantService
    {
        private readonly SystemDbContext _systemContext;
        private readonly ITenantService _tenantService;
        private readonly IServiceProvider _serviceProvider;
        private readonly SystemErrorLogService _errorLogService;

        public SystemTenantService(SystemDbContext systemContext, ITenantService tenantService, IServiceProvider serviceProvider, SystemErrorLogService errorLogService)
        {
            _systemContext = systemContext;
            _tenantService = tenantService;
            _serviceProvider = serviceProvider;
            _errorLogService = errorLogService;
        }

        public async Task<PagedResponse> GetTenantsAsync(PagedRequest request)
        {
            var response = new PagedResponse();
            
            var query = _systemContext.Tenants.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(t => t.Name.ToLower().Contains(searchTerm) || t.AdminEmail.ToLower().Contains(searchTerm));
            }

            var totalRecords = await query.CountAsync();

            query = query.OrderByDynamic(
                string.IsNullOrEmpty(request.SortColumn) ? "CreatedAt" : request.SortColumn,
                string.IsNullOrEmpty(request.SortOrder) ? "desc" : request.SortOrder
            );

            var tenants = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();
            
            response.Success = true;
            response.Data = tenants;
            response.CurrentPage = request.PageIndex;
            response.PageSize = request.PageSize;
            response.TotalRecords = totalRecords;
            
            return response;
        }

        public async Task<ApiResponse> CreateTenantAsync(CreateTenantRequest request)
        {
            var response = new ApiResponse();

            // 1. Kiểm tra duplicate Admin Email
            var existingTenant = await _systemContext.Tenants.FirstOrDefaultAsync(t => t.AdminEmail == request.AdminEmail);
            if (existingTenant != null)
            {
                response.Success = false;
                response.Message = "Email admin này đã được sử dụng cho một khách hàng khác.";
                return response;
            }

            // Tạo Schema Name hợp lệ (chỉ chữ thường và số)
            var cleanName = Regex.Replace(request.Name.ToLower(), @"[^a-z0-9]", "");
            var schemaName = $"t_{cleanName}_{Guid.NewGuid().ToString("N").Substring(0, 4)}";

            var tenant = new SystemAdmin.Entities.Tenant
            {
                Name = request.Name,
                AdminEmail = request.AdminEmail,
                SchemaName = schemaName,
                Type = request.Type,
                Status = TenantStatus.Active,
                CreatedAt = DateTime.UtcNow
            };

            _systemContext.Tenants.Add(tenant);
            await _systemContext.SaveChangesAsync();

            // 2. Chạy Migration tạo Database Schema cho Tenant này
            try
            {
                // Resolving AppDbContext (nó sẽ lấy Schema mới từ TenantService trong Scope mới)
                using var scope = _serviceProvider.CreateScope();
                var scopedTenantService = scope.ServiceProvider.GetRequiredService<ITenantService>();
                scopedTenantService.SetCurrentTenantSchema(schemaName);

                var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Tạo schema thủ công trước vì EF Core có thể không tự tạo
                await appDbContext.Database.ExecuteSqlRawAsync($"CREATE SCHEMA IF NOT EXISTS \"{schemaName}\"");

                // Áp dụng các Migration của AppDbContext vào schema này
                await appDbContext.Database.MigrateAsync();

                // 3. Tạo tài khoản Admin mặc định cho Tenant này
                var adminUser = new User
                {
                    FullName = request.AdminFullName,
                    Email = request.AdminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.AdminPassword),
                    IsSuperAdmin = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                appDbContext.Users.Add(adminUser);
                await appDbContext.SaveChangesAsync();

                response.Success = true;
                response.Message = "Tạo không gian dữ liệu khách hàng thành công!";
                response.Data = tenant;
                return response;
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "CreateTenantAsync");

                // Rollback: Xóa tenant khỏi System nếu tạo Schema thất bại
                _systemContext.Tenants.Remove(tenant);
                await _systemContext.SaveChangesAsync();
                
                response.Success = false;
                response.Message = $"Lỗi khi khởi tạo không gian dữ liệu cho Khách hàng: {ex.Message}";
                return response;
            }
        }

        public async Task<ApiResponse> UpdateStatusAsync(int id, TenantStatus status)
        {
            var response = new ApiResponse();
            var tenant = await _systemContext.Tenants.FindAsync(id);
            
            if (tenant == null) 
            {
                response.Success = false;
                response.Message = "Không tìm thấy Khách hàng.";
                return response;
            }

            tenant.Status = status;
            tenant.UpdatedAt = DateTime.UtcNow;
            await _systemContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Cập nhật trạng thái thành công.";
            response.Data = tenant;
            return response;
        }

        public async Task<ApiResponse> DeleteTenantAsync(int id)
        {
            var response = new ApiResponse();
            var tenant = await _systemContext.Tenants.FindAsync(id);
            
            if (tenant == null) 
            {
                response.Success = false;
                response.Message = "Không tìm thấy Khách hàng.";
                return response;
            }

            try 
            {
                using var scope = _serviceProvider.CreateScope();
                var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await appDbContext.Database.ExecuteSqlRawAsync($"DROP SCHEMA IF EXISTS \"{tenant.SchemaName}\" CASCADE");
            }
            catch(Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "DeleteTenantAsync");
                response.Success = false;
                response.Message = $"Không thể xóa dữ liệu Khách hàng: {ex.Message}";
                return response;
            }

            _systemContext.Tenants.Remove(tenant);
            await _systemContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Đã xóa hoàn toàn dữ liệu Khách hàng.";
            return response;
        }

        public async Task<ApiResponse> ChangeTenantAdminPasswordAsync(int id, string newPassword)
        {
            var response = new ApiResponse();
            var tenant = await _systemContext.Tenants.FindAsync(id);

            if (tenant == null)
            {
                response.Success = false;
                response.Message = "Không tìm thấy Khách hàng.";
                return response;
            }

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var scopedTenantService = scope.ServiceProvider.GetRequiredService<ITenantService>();
                scopedTenantService.SetCurrentTenantSchema(tenant.SchemaName);

                var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                var adminUser = await appDbContext.Users.FirstOrDefaultAsync(u => u.Email == tenant.AdminEmail);
                if (adminUser == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy tài khoản Admin của Khách hàng này.";
                    return response;
                }

                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await appDbContext.SaveChangesAsync();

                response.Success = true;
                response.Message = "Cấp lại mật khẩu Admin thành công.";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "ChangeTenantAdminPasswordAsync");
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi khi cấp lại mật khẩu: {ex.Message}";
            }

            return response;
        }
    }
}
