using FieldServiceAPI.SystemAdmin.DTOs.Base;
using FieldServiceAPI.SystemAdmin.Services.SystemErrorLog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FieldServiceAPI.SystemAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "SuperAdmin")]
    public class SystemErrorLogsController : ControllerBase
    {
        private readonly ISystemErrorLogQueryService _logQueryService;

        public SystemErrorLogsController(ISystemErrorLogQueryService logQueryService)
        {
            _logQueryService = logQueryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs([FromQuery] SystemPagedRequest request, [FromQuery] string? tenantSchema = null)
        {
            var response = await _logQueryService.GetLogsAsync(request, tenantSchema);
            return Ok(response);
        }
    }
}
