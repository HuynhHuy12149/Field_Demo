using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.Tenant.DTOs.Auth;
using FieldServiceAPI.Tenant.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FieldServiceAPI.Tenant.Services.Common;
using FieldServiceAPI.SystemAdmin.Services;

namespace FieldServiceAPI.Tenant.Services.Auth
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly SystemErrorLogService _errorLogService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ITenantService _tenantService;

        public AuthService(
            AppDbContext context, 
            IConfiguration configuration, 
            SystemErrorLogService errorLogService,
            IServiceProvider serviceProvider,
            ITenantService tenantService)
        {
            _context = context;
            _configuration = configuration;
            _errorLogService = errorLogService;
            _serviceProvider = serviceProvider;
            _tenantService = tenantService;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            try
            {
                var schemaName = _tenantService.GetCurrentTenantSchema();
                
                using var sysScope = _serviceProvider.CreateScope();
                var systemDb = sysScope.ServiceProvider.GetRequiredService<FieldServiceAPI.SystemAdmin.Data.SystemDbContext>();

                if (string.IsNullOrEmpty(schemaName))
                {
                    // Nếu không có header TenantSchema, tự động tìm schema qua bảng Tenants bằng AdminEmail
                    var tenant = await systemDb.Tenants.FirstOrDefaultAsync(t => t.AdminEmail == request.Email);
                    if (tenant != null)
                    {
                        if (tenant.Status != FieldServiceAPI.SystemAdmin.Entities.TenantStatus.Active)
                        {
                            throw new UnauthorizedAccessException("Tenant của bạn đã bị khóa hoặc không tồn tại!");
                        }
                        schemaName = tenant.SchemaName;
                    }
                    else
                    {
                        return null; // Không tìm thấy Tenant tương ứng với email này
                    }
                }
                else 
                {
                    // Nếu ĐÃ CÓ schema truyền lên từ header, vẫn phải kiểm tra xem Tenant đó có đang bị khóa hay không!
                    var tenant = await systemDb.Tenants.FirstOrDefaultAsync(t => t.SchemaName == schemaName);
                    if (tenant == null || tenant.Status != FieldServiceAPI.SystemAdmin.Entities.TenantStatus.Active)
                    {
                        throw new UnauthorizedAccessException("Tenant của bạn đã bị khóa hoặc không tồn tại!");
                    }
                }

                // Tạo scope mới để AppDbContext kết nối đúng schema
                using var scope = _serviceProvider.CreateScope();
                var scopedTenantService = scope.ServiceProvider.GetRequiredService<ITenantService>();
                scopedTenantService.SetCurrentTenantSchema(schemaName);
                
                var tenantContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var user = await tenantContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null || !user.IsActive)
                {
                    return null;
                }

                // Verify password
                bool isValid = false;
                try
                {
                    isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                }
                catch (BCrypt.Net.SaltParseException)
                {
                    // Xử lý trường hợp mật khẩu cũ chưa được băm
                    isValid = (request.Password == user.PasswordHash);
                    
                    // Cập nhật lại mật khẩu thành dạng băm để lần sau không bị nữa
                    if (isValid)
                    {
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                        tenantContext.Users.Update(user);
                        await tenantContext.SaveChangesAsync();
                    }
                }

                if (!isValid)
                {
                    return null;
                }

                // Generate Token
                var tokenString = GenerateJwtToken(user, schemaName);

                // Fetch Permissions
                var permissions = await tenantContext.UserRoles
                    .Where(ur => ur.UserId == user.Id)
                    .Join(tenantContext.RoleClaims, 
                          ur => ur.RoleId, 
                          rc => rc.RoleId, 
                          (ur, rc) => rc)
                    .Where(rc => rc.ClaimType == "Permission")
                    .Select(rc => rc.ClaimValue)
                    .Distinct()
                    .ToListAsync();

                if (user.IsSuperAdmin)
                {
                    if (!permissions.Contains("*"))
                    {
                        permissions.Add("*");
                    }
                }

                return new LoginResponse
                {
                    Token = tokenString,
                    FullName = user.FullName,
                    Email = user.Email,
                    Permissions = permissions.ToList()
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw; // Ném thẳng ra ngoài để Controller bắt
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "TenantLoginAsync");
                throw; // Rethrow to let the controller handle returning a 500 or just return null
            }
        }

        public async Task SeedAdminUserAsync()
        {
            var adminEmail = "admin@gmail.com";
            var existingAdmin = await _context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
            if (existingAdmin == null)
            {
                var newAdmin = new FieldServiceAPI.Tenant.Entities.User
                {
                    FullName = "System Administrator",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    IsSuperAdmin = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                _context.Users.Add(newAdmin);
                await _context.SaveChangesAsync();
            }
        }

        private string GenerateJwtToken(FieldServiceAPI.Tenant.Entities.User user, string schemaName)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("FullName", user.FullName),
                new Claim("TenantSchema", schemaName) // Quan trọng: Đưa TenantSchema vào Token để dùng cho các request sau
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<FieldServiceAPI.Tenant.DTOs.Base.ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var response = new FieldServiceAPI.Tenant.DTOs.Base.ApiResponse();
            try
            {
                // In AuthService, we must use the scoped AppDbContext provided, or resolve it.
                // Wait, _context is injected.
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    response.Success = false;
                    response.Message = "Tài khoản không tồn tại.";
                    return response;
                }

                // Old password verification removed at user request

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Đổi mật khẩu thành công.";
            }
            catch (Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "AuthChangePasswordAsync");
                response.Success = false;
                response.Message = "Đã xảy ra lỗi trong quá trình đổi mật khẩu.";
            }

            return response;
        }
    }
}
