using FieldServiceAPI.Data;
using FieldServiceAPI.DTOs.Province;
using Microsoft.EntityFrameworkCore;

namespace FieldServiceAPI.Services.Province
{
    public class ProvinceService
    {
        private readonly AppDbContext _context;

        public ProvinceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProvinceResponse>> GetAllAsync()
        {
            return await _context.Provinces
                .Select(p => new ProvinceResponse
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToListAsync();
        }
    }
}
