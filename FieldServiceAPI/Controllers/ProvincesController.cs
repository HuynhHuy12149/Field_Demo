using FieldServiceAPI.Services.Province;
using Microsoft.AspNetCore.Mvc;

namespace FieldServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProvincesController : ControllerBase
    {
        private readonly ProvinceService _service;

        public ProvincesController(ProvinceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var provinces = await _service.GetAllAsync();
            return Ok(provinces);
        }
    }
}
