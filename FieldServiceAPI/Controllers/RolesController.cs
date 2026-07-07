using FieldServiceAPI.DTOs.Base;
using FieldServiceAPI.DTOs.Role;
using FieldServiceAPI.Services.Role;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FieldServiceAPI.Controllers
{
    public class RolesController : BaseAuthorizedController
    {
        private readonly RoleService _roleService;

        public RolesController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PagedRequest pagedRequest)
        {
            var response = await _roleService.GetAllRolesAsync(pagedRequest);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoleRequest createRoleRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var response = await _roleService.CreateRoleAsync(createRoleRequest);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoleRequest updateRoleRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var response = await _roleService.UpdateRoleAsync(id, updateRoleRequest);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _roleService.DeleteRoleAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpGet("{id}/claims")]
        public async Task<IActionResult> GetClaims(int id)
        {
            var response = await _roleService.GetRoleClaimsAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("{id}/claims")]
        public async Task<IActionResult> UpdateClaims(int id, [FromBody] System.Collections.Generic.List<string> claims)
        {
            var response = await _roleService.UpdateRoleClaimsAsync(id, claims);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
