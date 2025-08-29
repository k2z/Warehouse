using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Model.Entities;
using Warehouse.Server.Utils;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/shipments")]

  public class ShipmentsController(
    DatabaseContext context,
    ILogger<ShipmentsController> logger)
    : ControllerBase
  {
    private readonly ILogger<ShipmentsController> _logger = logger;

    [HttpGet("allnumbers")]
    public async Task<ActionResult<IEnumerable<string>>> ListFilteringOptions()
    {
      var result = await context.Shipments.Select((i) => i.Number).ToListAsync();
      return Ok(result);
    }
    
    [HttpGet("all")]
    public async Task<ActionResult<Model.DataTransferObjects.Page<Model.DataTransferObjects.Shipment>>> ListIncomes(
      [FromQuery(Name = "filter")] IEnumerable<FilteringData>? filter,
      [FromQuery(Name = "skip")] int? skip,
      [FromQuery(Name = "take")] int? take)
    {
      var itemsQuery = context.Shipments.AsQueryable();
      if (filter != null && filter.Any())
      {
        var includingResourcesFilter = filter.SingleOrDefault(f => f.Field == "includingResources");
        if (includingResourcesFilter != null && includingResourcesFilter.NumberValues != null)
        {
          itemsQuery = itemsQuery.Where(item =>
            item.ShipmentResources.Any(ir => includingResourcesFilter.NumberValues.Contains(ir.ResourceId)));
        }
        var includingMeasuresFilter = filter.SingleOrDefault(f => f.Field == "includingMeasures");
        if (includingMeasuresFilter != null && includingMeasuresFilter.NumberValues != null)
        {
          itemsQuery = itemsQuery.Where(item =>
            item.ShipmentResources.Any(ir => includingMeasuresFilter.NumberValues.Contains(ir.MeasureId)));
        }
        var otherFilters = filter.Where(f => f.Field != "includingMeasures" && f.Field != "includingResources").ToArray();
        if (otherFilters.Any())
        {
          var expr = Warehouse.Server.Utils.Utils.ParseFilterExpression<Shipment>(otherFilters);
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

      var resultItems = itemsQuery.Select(i => new Model.DataTransferObjects.Shipment
      {
        Id = i.Id,
        Number = i.Number,
        Date = i.Date,
        Client = i.Client.Name,
        ClientId = i.ClientId,
        Items = i.ShipmentResources.Select((ir) => new Model.DataTransferObjects.ShipmentResource()
        {
          Id = ir.Id,
          Count = ir.Count,
          Resource = ir.Resource.Name,
          ResourceId = ir.ResourceId,
          Measure = ir.Measure.Name,
          MeasureId = ir.MeasureId,
        }).ToList()
      });
      var result = new Model.DataTransferObjects.Page<Model.DataTransferObjects.Shipment>
      {
        Items = await resultItems.ToListAsync(),
        Count = await context.Incomes.CountAsync(),
      };
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Income>> CreateShipment(
      [FromBody]Model.DataTransferObjects.Shipment newShipment
    )
    {
      if (newShipment.Number == null)
      {
        return BadRequest("number is null");
      }
      if (newShipment.Items == null)
      {
        return BadRequest("items is null");
      }

      if (!newShipment.ClientId.HasValue)
      {
        return BadRequest("clientId is null");
      }
      var newShipmentEntity = new Model.Entities.Shipment()
      {
        Number = newShipment.Number,
        Date = newShipment.Date ?? DateOnly.FromDateTime(DateTime.Now),
        ClientId = newShipment.ClientId.Value,
        Client = context.Clients.Single(c => c.Id == newShipment.ClientId),
        ShipmentResources = newShipment.Items.Select(ir => new Model.Entities.ShipmentResource()
        {
          Count = ir.Count!.Value,
          MeasureId = ir.MeasureId!.Value,
          Measure = context.Measures.Single(m => m.Id == ir.MeasureId!.Value),
          ResourceId = ir.ResourceId!.Value,
          Resource = context.Resources.Single(r => r.Id == ir.ResourceId!.Value),
        }).ToList()
      };
      await context.Shipments.AddAsync(newShipmentEntity);
      await context.SaveChangesAsync();
      var result = await context.Incomes.SingleAsync(i => i.Number == newShipment.Number);
      return Model.DataTransferObjects.Income.FromEntity(result);
    }

    // TODO update
    // TODO delete
  }
}
