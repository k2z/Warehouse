using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Utils;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/incomes")]
  public class IncomesController : ControllerBase
  {

    private readonly ILogger<IncomesController> _logger;
    private readonly DatabaseContext db;

    public IncomesController(
      DatabaseContext context,
      ILogger<IncomesController> logger
      )
    {
      this.db = context;
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<ActionResult<Model.DataTransferObjects.Page<Model.DataTransferObjects.Income>>> ListIncomes(
      [FromQuery(Name = "filter")] GridFilter? filter,
      [FromQuery(Name = "skip")] int? skip,
      [FromQuery(Name = "take")] int? take)
    {
      var itemsQuery = db.Incomes
        .Select(i => new Model.DataTransferObjects.Income
        {
          Id = i.Id,
          Number = i.Number,
          Date = i.Date,
          Items = i.IncomeResources.Select((ir) => new Model.DataTransferObjects.IncomeResource()
          {
            Id = ir.Id,
            Count = ir.Count,
            Resource = ir.Resource.Name,
            ResourceId = ir.ResourceId,
            Measure = ir.Measure.Name,
            MeasureId = ir.MeasureId,
          }).ToList()
        });
      if (filter != null)
      {
        // TODO support filtering
      }
      if (skip.HasValue)
      {
        itemsQuery = itemsQuery.Skip(skip.Value);
      }
      if (take.HasValue)
      {
        itemsQuery = itemsQuery.Take(take.Value);
      }
      var result = new Model.DataTransferObjects.Page<Model.DataTransferObjects.Income>
      {
        Items = await itemsQuery.ToListAsync(),
        Count = await db.Incomes.CountAsync(),
      };
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Income>> CreateIncome(
      [FromBody]Model.DataTransferObjects.Income newIncome
    )
    {
      if (newIncome.Number == null)
      {
        return BadRequest("number is null");
      }
      if (newIncome.Items == null)
      {
        return BadRequest("items is null");
      }
      var newIncomeEntity = new Model.Entities.Income
      {
        Number = newIncome.Number,
        Date = newIncome.Date ?? DateOnly.FromDateTime(DateTime.Now),
        IncomeResources = newIncome.Items.Select(ir => new Model.Entities.IncomeResource
        {
          Count = ir.Count!.Value,
          MeasureId = ir.MeasureId!.Value,
          Measure = db.Measures.Single(m => m.Id == ir.MeasureId!.Value),
          ResourceId = ir.ResourceId!.Value,
          Resource = db.Resources.Single(r => r.Id == ir.ResourceId!.Value),
        }).ToList()
      };
      await this.db.Incomes.AddAsync(newIncomeEntity);
      await this.db.SaveChangesAsync();
      var result = await this.db.Incomes.SingleAsync(i => i.Number == newIncome.Number);
      return Model.DataTransferObjects.Income.FromEntity(result);
    }

    // TODO update
    // TODO delete
  }
}