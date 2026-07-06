using FieldServiceAPI.DTOs.Base;
using FieldServiceAPI.Services.District;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FieldServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistrictsController : ControllerBase
    {
        private readonly DistrictService _districtService;

        public DistrictsController(DistrictService districtService)
        {
            _districtService = districtService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PagedRequest request)
        {
            var response = await _districtService.GetAllAsync(request);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
