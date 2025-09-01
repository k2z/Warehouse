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
        State = i.State,
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
      [FromBody] Model.DataTransferObjects.Shipment newShipment
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
      };
      var changes = DocumentProcessing.ApplyChanges(
        newShipmentEntity.ShipmentResources,
        newShipment.Items,
        context.Measures,
        context.Resources);
      await context.Shipments.AddAsync(newShipmentEntity);
      await context.SaveChangesAsync();
      var result = await context.Shipments.SingleAsync(i => i.Number == newShipment.Number);
      return Ok(Model.DataTransferObjects.Shipment.FromEntity(result));
    }
    
    [HttpPost("update")]
    public async Task<ActionResult<Model.DataTransferObjects.Shipment>> UpdateShipment(Model.DataTransferObjects.Shipment updated)
    {
      if (!updated.Id.HasValue)
      {
        return BadRequest("id is null");
      }
      if (updated.Items == null)
      {
        return BadRequest("items is null");
      }
      var existing = await context.Shipments
        .Include(s => s.Client)
        .Include(shipment => shipment.ShipmentResources)
          .ThenInclude(sr => sr.Measure)
        .Include(shipment => shipment.ShipmentResources)
          .ThenInclude(sr => sr.Resource)
        .SingleAsync(i => i.Id == updated.Id);
      existing.Number = updated.Number ?? existing.Number;
      
      if (updated.ClientId.HasValue && updated.ClientId != existing.ClientId)
      {
        existing.ClientId = updated.ClientId.Value;
        existing.Client = context.Clients.Single(c => c.Id == updated.ClientId);
      }

      var changes = DocumentProcessing.ApplyChanges(
        existing.ShipmentResources,
        updated.Items,
        context.Measures,
        context.Resources);
      if (updated.State == ShipmentState.Signed && ( existing.State == ShipmentState.Rejected || existing.State == ShipmentState.Created))
      {
        var shipmentChanges = new List<ResourceChange>();
        foreach (var shipmentItem in existing.ShipmentResources)
        {
          shipmentChanges.Add(new ResourceChange(){ Change = -shipmentItem.Count, MeasureId = shipmentItem.MeasureId, ResourceId = shipmentItem.ResourceId });
        }
        await DocumentProcessing.ApplyChangesToBalances(shipmentChanges, context.Balances);
      } else if (updated.State == ShipmentState.Rejected && existing.State == ShipmentState.Signed)
      {
        var shipmentChanges = new List<ResourceChange>();
        foreach (var shipmentItem in existing.ShipmentResources)
        {
          shipmentChanges.Add(new ResourceChange(){ Change = shipmentItem.Count, MeasureId = shipmentItem.MeasureId, ResourceId = shipmentItem.ResourceId });
        }
        await DocumentProcessing.ApplyChangesToBalances(shipmentChanges, context.Balances);
      }
      existing.State = updated.State ?? existing.State;
      await context.SaveChangesAsync();
      var result = await context.Shipments
        .Include(s => s.Client)
        .Include(shipment => shipment.ShipmentResources)
          .ThenInclude(sr => sr.Measure)
        .Include(shipment => shipment.ShipmentResources)
          .ThenInclude(sr => sr.Resource)
        .SingleAsync(i => i.Id == updated.Id);
      return Ok(Model.DataTransferObjects.Shipment.FromEntity(result));
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteIncome(Model.DataTransferObjects.Shipment deleted)
    {
      if (deleted.Id == null)
      {
        return BadRequest("deleted.id is null");
      }
      var entity = await context.Shipments.SingleAsync(r => r.Id == deleted.Id);
      context.Shipments.Remove(entity);
      await context.SaveChangesAsync();
      return Ok();
    }
  }
}
