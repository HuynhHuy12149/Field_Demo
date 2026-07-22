using System;
using System.Linq;
using System.Threading.Tasks;
using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.Tenant.DTOs.Base;
using FieldServiceAPI.Tenant.DTOs.Users;
using FieldServiceAPI.Tenant.Entities;
using FieldServiceAPI.Extensions;
using FieldServiceAPI.Tenant.Mappers;
using FieldServiceAPI.Tenant.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.Tenant.Services.User
{
    public class UserService
    {
        private readonly AppDbContext _context;
        private readonly SystemErrorLogService _errorLogService;

        public UserService(AppDbContext context, SystemErrorLogService errorLogService)
        {
            _context = context;
            _errorLogService = errorLogService;
        }

        public async Task<PagedResponse> GetAllUsersAsync(PagedRequest pagedRequest)
        {
            var response = new PagedResponse();
            try
            {
                var searchTerm = pagedRequest.SearchTerm?.NormalizeSearch();

                var query = _context.Users.AsQueryable()
                    .WhereIf(!string.IsNullOrEmpty(searchTerm), x => x.FullName.ToLower().Contains(searchTerm!) || x.Email.ToLower().Contains(searchTerm!))
                    .OrderByDynamic(pagedRequest.SortColumn, pagedRequest.SortOrder);

                int totalRecords = await query.CountAsync();

                var users = await query
                    .Include(u => u.UserRoles)
                    .Skip((pagedRequest.PageIndex - 1) * pagedRequest.PageSize)
                    .Take(pagedRequest.PageSize)
                    .ToListAsync();

                var data = users.Select(u => {
                    var dto = u.ToDTO();
                    dto.RoleIds = u.UserRoles.Select(ur => ur.RoleId).ToList();
                    return dto;
                }).ToList();

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

        public async Task<ApiResponse> CreateUserAsync(UserRequest request)
        {
            var response = new ApiResponse();
            try
            {
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                {
                    response.Message = "Email đã tồn tại trong hệ thống";
                    return response;
                }

                var entity = request.ToEntity();
                
                // Hash mật khẩu
                string plainPassword = request.Password ?? "123456";
                entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword); 

                _context.Users.Add(entity);
                await _context.SaveChangesAsync();

                if (request.RoleIds != null && request.RoleIds.Any())
                {
                    var userRoles = request.RoleIds.Select(roleId => new UserRole
                    {
                        UserId = entity.Id,
                        RoleId = roleId
                    }).ToList();
                    _context.UserRoles.AddRange(userRoles);
                    await _context.SaveChangesAsync();
                }
                
                var responseDto = entity.ToDTO();
                responseDto.RoleIds = request.RoleIds ?? new List<int>();
                response.Data = responseDto;
                response.Success = true;
                response.Message = "Thêm mới Người dùng thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> UpdateUserAsync(int id, UserRequest request)
        {
            var response = new ApiResponse();
            try
            {
                var entity = await _context.Users.FindAsync(id);
                if (entity == null)
                {
                    response.Message = "Không tìm thấy Người dùng";
                    return response;
                }

                if (await _context.Users.AnyAsync(x => x.Email == request.Email && x.Id != id))
                {
                    response.Message = "Email đã tồn tại trong hệ thống";
                    return response;
                }

                request.UpdateEntity(entity);
                _context.Entry(entity).State = EntityState.Modified;

                // Nếu có nhập mật khẩu mới thì băm và cập nhật
                if (!string.IsNullOrEmpty(request.Password))
                {
                    entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password); 
                }

                if (request.RoleIds != null)
                {
                    var existingRoles = await _context.UserRoles.Where(ur => ur.UserId == entity.Id).ToListAsync();
                    var existingRoleIds = existingRoles.Select(ur => ur.RoleId).ToList();
                    var newRoleIds = request.RoleIds;

                    var rolesToRemove = existingRoles.Where(ur => !newRoleIds.Contains(ur.RoleId)).ToList();
                    var rolesToAdd = newRoleIds.Where(id => !existingRoleIds.Contains(id)).Select(roleId => new UserRole
                    {
                        UserId = entity.Id,
                        RoleId = roleId
                    }).ToList();

                    if (rolesToRemove.Any())
                    {
                        _context.UserRoles.RemoveRange(rolesToRemove);
                        _context.Entry(entity).State = EntityState.Modified;
                    }

                    if (rolesToAdd.Any())
                    {
                        _context.UserRoles.AddRange(rolesToAdd);
                        _context.Entry(entity).State = EntityState.Modified;
                    }
                }

                await _context.SaveChangesAsync();
                
                var responseDto = entity.ToDTO();
                responseDto.RoleIds = request.RoleIds ?? new List<int>();
                response.Data = responseDto;
                response.Success = true;
                response.Message = "Cập nhật Người dùng thành công";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex);
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse> DeleteUserAsync(int id)
        {
            var response = new ApiResponse();
            try
            {
                var entity = await _context.Users.FindAsync(id);
                if (entity == null)
                {
                    response.Message = "Không tìm thấy Người dùng";
                    return response;
                }

                entity.IsDeleted = true;
                entity.DeletedAt = DateTime.UtcNow;
                _context.Users.Update(entity);
                await _context.SaveChangesAsync();
                
                response.Data = true;
                response.Success = true;
                response.Message = "Xóa Người dùng thành công";
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
