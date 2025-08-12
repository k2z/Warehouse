using AngularApp1.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model.Entities;
using Warehouse.Server.Model.DataTransferObjects;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("resources")]
  public class ResourcesController : ControllerBase
  {

    private readonly ILogger<WeatherForecastController> _logger;

    public ResourcesController(ILogger<WeatherForecastController> logger)
    {
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> ListAllResources()
    {
      using (var db = new DatabaseContext())
      {
        var result = await db.Resources
          .Select(r => new Model.DataTransferObjects.Resource { Id = r.Id, Name = r.Name, Status = r.Status })
          .ToListAsync();
        return Ok(result);
      }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddNewResource(string name)
    {
      using (var db = new DatabaseContext())
      {
        Model.Entities.Resource newItem = new() { Name = name, Status = ResourceStatus.Active };
        await db.Resources.AddAsync(newItem);
        await db.SaveChangesAsync();
        var result = await db.Resources.SingleAsync(r => r.Name == name);
        return Ok(result);
      }
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateResource(Model.DataTransferObjects.Resource updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
      using (var db = new DatabaseContext())
      {
        var existing = db.Resources.Single(r => r.Id == updated.Id);
        if (updated.Status != null)
        {
          existing.Status = (ResourceStatus)updated.Status;
        }
        if (updated.Name != null)
        {
          existing.Name = (string)updated.Name;
        }
        await db.SaveChangesAsync();
        return Ok();
      }
    }
  }
}
