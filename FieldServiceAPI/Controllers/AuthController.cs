using FieldServiceAPI.DTOs.Auth;
using FieldServiceAPI.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace FieldServiceAPI.Controllers
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

            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
            }

            return Ok(response);
        }

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult GetCurrentUser([FromServices] FieldServiceAPI.Services.Common.ICurrentUserService currentUserService)
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
    }
}
