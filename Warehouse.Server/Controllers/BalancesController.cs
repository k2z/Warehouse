using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;

namespace Warehouse.Server.Controllers
{
    [ApiController]
    [Route("api/balances")]
    public class BalancesController(
        DatabaseContext context,
        ILogger<ShipmentsController> logger)
      : ControllerBase
    {
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Model.DataTransferObjects.Balance>>> ListAllBalances()
        {
            var result = await context.Balances
                .Include(b => b.Resource)
                .Include(b => b.Measure)
                .Select(b => new Model.DataTransferObjects.Balance() { Id = b.Id, Count = b.Count, ResourceId = b.ResourceId, Resource = b.Resource.Name, MeasureId = b.Measure.Id, Measure = b.Measure.Name })
                .ToListAsync();
            return Ok(result);
        }
    }
}
