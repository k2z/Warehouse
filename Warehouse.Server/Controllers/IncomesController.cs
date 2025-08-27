using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Utils;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/incomes")]
  public class IncomesController(
    DatabaseContext context,
    ILogger<IncomesController> logger)
    : ControllerBase
  {

    private readonly ILogger<IncomesController> _logger = logger;

    [HttpGet("allnumbers")]
    public async Task<ActionResult<IEnumerable<string>>> ListFilteringOptions()
    {
      var result = await context.Incomes.Select((i) => i.Number).ToListAsync();
      return Ok(result);
    }
    
    [HttpGet("all")]
    public async Task<ActionResult<Model.DataTransferObjects.Page<Model.DataTransferObjects.Income>>> ListIncomes(
      [FromQuery(Name = "filter")] string? filter,
      [FromQuery(Name = "skip")] int? skip,
      [FromQuery(Name = "take")] int? take)
    {
      var itemsQuery = context.Incomes
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
        Count = await context.Incomes.CountAsync(),
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
          Measure = context.Measures.Single(m => m.Id == ir.MeasureId!.Value),
          ResourceId = ir.ResourceId!.Value,
          Resource = context.Resources.Single(r => r.Id == ir.ResourceId!.Value),
        }).ToList()
      };
      await context.Incomes.AddAsync(newIncomeEntity);
      await context.SaveChangesAsync();
      var result = await context.Incomes.SingleAsync(i => i.Number == newIncome.Number);
      return Model.DataTransferObjects.Income.FromEntity(result);
    }

    // TODO update
    // TODO delete
  }
}