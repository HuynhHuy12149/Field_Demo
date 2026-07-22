using System.Security.Claims;

namespace FieldServiceAPI.Tenant.Services.Common;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? Email { get; }
    string? FullName { get; }
    bool IsAuthenticated { get; }
}

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? UserId => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? Email => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
    public string? FullName => httpContextAccessor.HttpContext?.User?.FindFirstValue("FullName");
    public bool IsAuthenticated => httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
}
