using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FieldServiceAPI.Tenant.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseAuthorizedController : ControllerBase
    {
    }
}
