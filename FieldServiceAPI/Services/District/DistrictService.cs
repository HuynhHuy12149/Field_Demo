using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FieldServiceAPI.Data;
using FieldServiceAPI.DTOs.Base;
using FieldServiceAPI.DTOs.Province;
using FieldServiceAPI.Entities;
using FieldServiceAPI.Extensions;
using FieldServiceAPI.Services.Common;
using FieldServiceAPI.Mappers;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.Services.District
{
    public class DistrictService
    {
        private readonly AppDbContext _context;
        private readonly SystemErrorLogService _errorLogService;
        private readonly FieldServiceAPI.Services.Common.ICurrentUserService _currentUserService;

        public DistrictService(
            AppDbContext context, 
            SystemErrorLogService errorLogService,
            FieldServiceAPI.Services.Common.ICurrentUserService currentUserService)
        {
            _context = context;
            _errorLogService = errorLogService;
            _currentUserService = currentUserService;
        }

        public async Task<PagedResponse> GetAllAsync(PagedRequest request)
        {
            var response = new PagedResponse();
            
            try
            {
                var query = _context.Districts.AsQueryable();

                query = query
                    .WhereIf(!string.IsNullOrEmpty(request.SearchTerm), x => x.Name.Contains(request.SearchTerm!))
                    .OrderByDynamic(request.SortColumn, request.SortOrder);

                int totalRecords = await query.CountAsync();

                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ProjectToDTO()
                    .ToListAsync();

                response.Success = true;
                response.Data = data;
                response.TotalRecords = totalRecords;
                response.CurrentPage = request.PageIndex;
                response.PageSize = request.PageSize;
            }
            catch (Exception ex)
            {
                // Gọi hàm Server dùng chung để lưu lỗi
                await _errorLogService.LogErrorAsync(ex, "Lỗi khi lấy danh sách District");
                
                response.Message = "Có lỗi xảy ra trong quá trình lấy dữ liệu: " + ex.Message;
            }

            return response;
        }
    }
}
