using FieldServiceAPI.SystemAdmin.Entities;
using FieldServiceAPI.SystemAdmin.Services;
using FieldServiceAPI.SystemAdmin.DTOs.SystemTenant;
using Microsoft.AspNetCore.Mvc;

namespace FieldServiceAPI.SystemAdmin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Bật Authorize sau, hiện tại để test
    public class SystemTenantsController : ControllerBase
    {
        private readonly ISystemTenantService _tenantService;

        public SystemTenantsController(ISystemTenantService tenantService)
        {
            _tenantService = tenantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTenants([FromQuery] FieldServiceAPI.Tenant.DTOs.Base.PagedRequest pagedRequest)
        {
            var response = await _tenantService.GetTenantsAsync(pagedRequest);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequest request)
        {
            var response = await _tenantService.CreateTenantAsync(request);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] TenantStatus status)
        {
            var response = await _tenantService.UpdateStatusAsync(id, status);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTenant(int id)
        {
            var response = await _tenantService.DeleteTenantAsync(id);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }

        [HttpPut("{id}/change-admin-password")]
        public async Task<IActionResult> ChangeAdminPassword(int id, [FromBody] ChangeTenantAdminPasswordRequest request)
        {
            var response = await _tenantService.ChangeTenantAdminPasswordAsync(id, request.NewPassword);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }
    }
}
