using FieldServiceAPI.SystemAdmin.DTOs.SystemAuth;
using FieldServiceAPI.SystemAdmin.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FieldServiceAPI.SystemAdmin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemAuthController : ControllerBase
    {
        private readonly ISystemAuthService _authService;

        public SystemAuthController(ISystemAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] SystemLoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [Authorize(Policy = "SuperAdmin")]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] SystemChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
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
