using FieldServiceAPI.Data;
using FieldServiceAPI.DTOs.Auth;
using FieldServiceAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FieldServiceAPI.Services.Auth
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
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
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                }
            }

            if (!isValid)
            {
                return null;
            }

            // Generate Token
            var token = GenerateJwtToken(user);

            // Fetch Permissions
            var permissions = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Join(_context.RoleClaims, 
                      ur => ur.RoleId, 
                      rc => rc.RoleId, 
                      (ur, rc) => rc)
                .Where(rc => rc.ClaimType == "Permission")
                .Select(rc => rc.ClaimValue)
                .Distinct()
                .ToListAsync();

            return new LoginResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Permissions = permissions
            };
        }

        public async Task SeedAdminUserAsync()
        {
            var adminEmail = "admin@gmail.com";
            var existingAdmin = await _context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
            if (existingAdmin == null)
            {
                var newAdmin = new FieldServiceAPI.Entities.User
                {
                    FullName = "System Administrator",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                _context.Users.Add(newAdmin);
                await _context.SaveChangesAsync();
            }
        }

        private string GenerateJwtToken(FieldServiceAPI.Entities.User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("FullName", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
