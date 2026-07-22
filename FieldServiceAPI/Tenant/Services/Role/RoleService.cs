using System;
using System.Linq;
using System.Threading.Tasks;
using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.Tenant.DTOs.Base;
using FieldServiceAPI.Tenant.DTOs.Role;
using FieldServiceAPI.Tenant.Entities;
using FieldServiceAPI.Extensions;
using FieldServiceAPI.Tenant.Mappers;
using FieldServiceAPI.Tenant.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.Tenant.Services.Role
{
    public class RoleService
    {
        private readonly AppDbContext _context;
        private readonly SystemErrorLogService _errorLogService;

        public RoleService(AppDbContext context, SystemErrorLogService errorLogService)
        {
            _context = context;
            _errorLogService = errorLogService;
        }

        public async Task<PagedResponse> GetAllRolesAsync(PagedRequest pagedRequest)
        {
            var response = new PagedResponse();
            try
            {
                var searchTerm = pagedRequest.SearchTerm?.NormalizeSearch();

                var query = _context.Roles.AsQueryable()
                    .WhereIf(!string.IsNullOrEmpty(searchTerm), x => x.Name.ToLower().Contains(searchTerm!))
                    .OrderByDynamic(pagedRequest.SortColumn, pagedRequest.SortOrder);

                int totalRecords = await query.CountAsync();

                var data = await query
                    .Skip((pagedRequest.PageIndex - 1) * pagedRequest.PageSize)
                    .Take(pagedRequest.PageSize)
                    .ProjectToDTO()
                    .ToListAsync();

                response.Data = data;
                response.TotalRecords = totalRecords;
                response.CurrentPage = pagedRequest.PageIndex;
                response.PageSize = pagedRequest.PageSize;
                response.Success = true;
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> CreateRoleAsync(RoleRequest createRoleRequest)
        {
            var response = new ApiResponse();
            try
            {
                var entity = createRoleRequest.ToEntity();
                _context.Roles.Add(entity);
                await _context.SaveChangesAsync();
                
                response.Data = entity.ToDTO();
                response.Success = true;
                response.Message = "Thêm mới Nhóm quyền thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> UpdateRoleAsync(int roleId, RoleRequest updateRoleRequest)
        {
            var response = new ApiResponse();
            try
            {
                var entity = await _context.Roles.FindAsync(roleId);
                if (entity == null)
                {
                    response.Message = "Không tìm thấy Nhóm quyền";
                    return response;
                }

                updateRoleRequest.UpdateEntity(entity);
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                response.Data = entity.ToDTO();
                response.Success = true;
                response.Message = "Cập nhật Nhóm quyền thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> DeleteRoleAsync(int roleId)
        {
            var response = new ApiResponse();
            try
            {
                var entity = await _context.Roles.FindAsync(roleId);
                if (entity == null)
                {
                    response.Message = "Không tìm thấy Nhóm quyền";
                    return response;
                }

                entity.IsDeleted = true;
                entity.DeletedAt = DateTime.UtcNow;
                _context.Roles.Update(entity);
                await _context.SaveChangesAsync();
                
                response.Data = true;
                response.Success = true;
                response.Message = "Xóa Nhóm quyền thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> GetRoleClaimsAsync(int roleId)
        {
            var response = new ApiResponse();
            try
            {
                var claims = await _context.RoleClaims
                    .Where(x => x.RoleId == roleId && x.ClaimType == "Permission")
                    .Select(x => x.ClaimValue)
                    .ToListAsync();
                
                response.Data = claims;
                response.Success = true;
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> UpdateRoleClaimsAsync(int roleId, List<string> claims)
        {
            var response = new ApiResponse();
            try
            {
                var existingClaims = await _context.RoleClaims
                    .Where(x => x.RoleId == roleId && x.ClaimType == "Permission")
                    .ToListAsync();
                var existingClaimValues = existingClaims.Select(c => c.ClaimValue).ToList();
                var newClaimValues = claims ?? new List<string>();

                var claimsToRemove = existingClaims.Where(c => !newClaimValues.Contains(c.ClaimValue)).ToList();
                var claimsToAdd = newClaimValues.Where(c => !existingClaimValues.Contains(c)).Select(c => new RoleClaim
                {
                    RoleId = roleId,
                    ClaimType = "Permission",
                    ClaimValue = c
                }).ToList();

                if (claimsToRemove.Any())
                {
                    _context.RoleClaims.RemoveRange(claimsToRemove);
                }

                if (claimsToAdd.Any())
                {
                    _context.RoleClaims.AddRange(claimsToAdd);
                }
                
                await _context.SaveChangesAsync();

                response.Data = true;
                response.Success = true;
                response.Message = "Cập nhật Phân quyền thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }
    }
}
