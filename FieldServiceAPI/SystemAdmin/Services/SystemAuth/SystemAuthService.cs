using FieldServiceAPI.Tenant.DTOs.Base;
using FieldServiceAPI.SystemAdmin.Data;
using FieldServiceAPI.SystemAdmin.DTOs.SystemAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FieldServiceAPI.Tenant.Services.Common;

namespace FieldServiceAPI.SystemAdmin.Services
{
    public interface ISystemAuthService
    {
        Task<ApiResponse> LoginAsync(SystemLoginRequest request);
        Task<ApiResponse> ChangePasswordAsync(int userId, SystemChangePasswordRequest request);
    }

    public class SystemAuthService : ISystemAuthService
    {
        private readonly SystemDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly SystemErrorLogService _errorLogService;

        public SystemAuthService(SystemDbContext context, IConfiguration configuration, SystemErrorLogService errorLogService)
        {
            _context = context;
            _configuration = configuration;
            _errorLogService = errorLogService;
        }

        public async Task<ApiResponse> LoginAsync(SystemLoginRequest request)
        {
            var response = new ApiResponse();
            
            try 
            {
                var user = await _context.SystemUsers.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    response.Success = false;
                    response.Message = "Email hoặc mật khẩu không chính xác.";
                    return response;
                }

                if (!user.IsActive)
                {
                    response.Success = false;
                    response.Message = "Tài khoản đã bị vô hiệu hóa.";
                    return response;
                }

                // Generate JWT Token
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim("UserType", "SuperAdmin"),
                    new Claim("TenantSchema", "public")
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                    Issuer = jwtSettings["Issuer"],
                    Audience = jwtSettings["Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                response.Success = true;
                response.Message = "Đăng nhập thành công";
                response.Data = new
                {
                    Token = tokenString,
                    User = new
                    {
                        user.Id,
                        user.FullName,
                        user.Email,
                        Type = "SuperAdmin"
                    }
                };
            }
            catch(Exception ex)
            {
                await _errorLogService.LogErrorAsync(ex, "SystemLoginAsync");
                response.Success = false;
                response.Message = "Đã xảy ra lỗi trong quá trình xử lý đăng nhập hệ thống.";
            }

            return response;
        }
        public async Task<ApiResponse> ChangePasswordAsync(int userId, SystemChangePasswordRequest request)
        {
            var response = new ApiResponse();
            try
            {
                var user = await _context.SystemUsers.FindAsync(userId);
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
                await _errorLogService.LogErrorAsync(ex, "SystemChangePasswordAsync");
                response.Success = false;
                response.Message = "Đã xảy ra lỗi trong quá trình đổi mật khẩu.";
            }

            return response;
        }
    }
}
