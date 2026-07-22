using FieldServiceAPI.Tenant.DTOs.Auth;
using FieldServiceAPI.Tenant.Services.Auth;
using FieldServiceAPI.Tenant.Services.Common;
using Microsoft.AspNetCore.Mvc;

namespace FieldServiceAPI.Tenant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                {
                    return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
                }

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult GetCurrentUser([FromServices] FieldServiceAPI.Tenant.Services.Common.ICurrentUserService currentUserService)
        {
            if (!currentUserService.IsAuthenticated)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                currentUserService.UserId,
                currentUserService.Email,
                currentUserService.FullName
            });
        }

        [HttpPut("change-password")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, [FromServices] ICurrentUserService currentUserService)
        {
            if (!currentUserService.IsAuthenticated)
            {
                return Unauthorized();
            }

            if (!int.TryParse(currentUserService.UserId, out int userId))
            {
                return Unauthorized();
            }

            var response = await _authService.ChangePasswordAsync(userId, request);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
