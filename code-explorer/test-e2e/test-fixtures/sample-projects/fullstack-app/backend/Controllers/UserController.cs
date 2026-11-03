using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers {
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserController : ControllerBase {
        
        [HttpGet]
        public IActionResult GetUsers() {
            return Ok(new string[] { "Alice", "Bob" });
        }
    }
}