using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Utils;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("incomes")]
  public class IncomesController : ControllerBase
  {

    private readonly ILogger<IncomesController> _logger;

    public IncomesController(ILogger<IncomesController> logger)
    {
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> ListIncomes([FromQuery(Name = "filter")]GridFilter? filter, [FromQuery(Name = "skip")]int? skip, [FromQuery(Name = "take")]int? take)
    {
      using (var db = new DatabaseContext())
      {
        // TODO implement params
        var result = await db.Incomes
          .Select(i => new Model.DataTransferObjects.Income { Id = i.Id, When = i.Date /* TODO */ })
          .ToListAsync();
        return Ok(result);
      }
    }

    // TODO edit, add etc
  }
}