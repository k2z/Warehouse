using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Model.Entities;
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
      [FromQuery(Name = "filter")] IEnumerable<FilteringData>? filter,
      [FromQuery(Name = "skip")] int? skip,
      [FromQuery(Name = "take")] int? take)
    {
      var itemsQuery = context.Incomes.AsQueryable();
      if (filter != null && filter.Any())
      {
        var includingResourcesFilter = filter.SingleOrDefault(f => f.Field == "includingResources");
        if (includingResourcesFilter != null && includingResourcesFilter.NumberValues != null)
        {
          itemsQuery = itemsQuery.Where(item =>
            item.IncomeResources.Any(ir => includingResourcesFilter.NumberValues.Contains(ir.ResourceId)));
        }
        var includingMeasuresFilter = filter.SingleOrDefault(f => f.Field == "includingMeasures");
        if (includingMeasuresFilter != null && includingMeasuresFilter.NumberValues != null)
        {
          itemsQuery = itemsQuery.Where(item =>
            item.IncomeResources.Any(ir => includingMeasuresFilter.NumberValues.Contains(ir.MeasureId)));
        }
        var otherFilters = filter.Where(f => f.Field != "includingMeasures" && f.Field != "includingResources").ToArray();
        if (otherFilters.Any())
        {
          var expr = Warehouse.Server.Utils.Utils.ParseFilterExpression<Income>(otherFilters);
          itemsQuery = itemsQuery.Where(expr);
        }
      }
      if (skip.HasValue)
      {
        itemsQuery = itemsQuery.Skip(skip.Value);
      }
      if (take.HasValue)
      {
        itemsQuery = itemsQuery.Take(take.Value);
      }

      var resultItems = itemsQuery.Select(i => new Model.DataTransferObjects.Income
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
      var result = new Model.DataTransferObjects.Page<Model.DataTransferObjects.Income>
      {
        Items = await resultItems.ToListAsync(),
        Count = await context.Incomes.CountAsync(),
      };
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Income>> CreateIncome(
      [FromBody] Model.DataTransferObjects.Income newIncome
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
      return Ok(Model.DataTransferObjects.Income.FromEntity(result));
    }

    [HttpPost("update")]
    public async Task<ActionResult<Model.DataTransferObjects.Income>> UpdateIncome(Model.DataTransferObjects.Income updated)
    {
      if (!updated.Id.HasValue)
      {
        return BadRequest("id is null");
      }
      if (updated.Items == null)
      {
        return BadRequest("items is null");
      }
      var existing = await context.Incomes
        .Include(income => income.IncomeResources)
          .ThenInclude(ir => ir.Measure)
        .Include(income => income.IncomeResources)
          .ThenInclude(ir => ir.Resource)
        .SingleAsync(i => i.Id == updated.Id);
      existing.Number = updated.Number ?? existing.Number;

      var incomeResourcesToRemove = existing.IncomeResources.Where(ir => !updated.Items.Any(ui => ui.Id == ir.Id));
      foreach (var removingResource in incomeResourcesToRemove)
      {
        existing.IncomeResources.Remove(removingResource);
      }
      foreach (var updatingResourceDto in updated.Items)
      {
        var existingIncomeResource = existing.IncomeResources.FirstOrDefault(ir => ir.Id == updatingResourceDto.Id);
        if (existingIncomeResource == null)
        {
          var newIncomeResource = new IncomeResource
          {
            Count = updatingResourceDto.Count!.Value,
            MeasureId = updatingResourceDto.MeasureId!.Value,
            Measure = context.Measures.Single(m => m.Id == updatingResourceDto.MeasureId!.Value),
            ResourceId = updatingResourceDto.ResourceId!.Value,
            Resource = context.Resources.Single(r => r.Id == updatingResourceDto.ResourceId!.Value),
          };
          existing.IncomeResources.Add(newIncomeResource);
          continue;
        }
        existingIncomeResource.Count = updatingResourceDto.Count!.Value;
        if (existingIncomeResource.ResourceId != updatingResourceDto.ResourceId)
        {
          existingIncomeResource.ResourceId = updatingResourceDto.ResourceId!.Value;
          existingIncomeResource.Resource = context.Resources.Single(r => r.Id == updatingResourceDto.ResourceId!.Value);
        }
        if (existingIncomeResource.MeasureId != updatingResourceDto.MeasureId)
        {
          existingIncomeResource.MeasureId = updatingResourceDto.MeasureId!.Value;
          existingIncomeResource.Measure = context.Measures.Single(r => r.Id == updatingResourceDto.MeasureId!.Value);
        }
      }
      await context.SaveChangesAsync();
      var result = await context.Incomes
        .Include(income => income.IncomeResources)
          .ThenInclude(ir => ir.Measure)
        .Include(income => income.IncomeResources)
          .ThenInclude(ir => ir.Resource)
        .SingleAsync(i => i.Id == updated.Id);
      return Ok(Model.DataTransferObjects.Income.FromEntity(result));
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteIncome(Model.DataTransferObjects.Income deleted)
    {
      if (deleted.Id == null)
      {
        return BadRequest("deleted.id is null");
      }
      var entity = await context.Incomes.SingleAsync(r => r.Id == deleted.Id);
      context.Incomes.Remove(entity);
      await context.SaveChangesAsync();
      return Ok();
    }
  }
}