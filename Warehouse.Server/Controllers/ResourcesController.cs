using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/resources")]
  public class ResourcesController : ControllerBase
  {

    private readonly ILogger<ResourcesController> logger;
    private readonly DatabaseContext db;

    public ResourcesController(
      DatabaseContext context,
      ILogger<ResourcesController> logger
      )
    {
      this.db = context;
      this.logger = logger;
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Model.DataTransferObjects.Resource>>> ListAllResources()
    {
      var result = await db.Resources
        .Select(r => new Model.DataTransferObjects.Resource { Id = r.Id, Name = r.Name, Status = r.Status })
        .ToListAsync();
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Resource>> AddNewResource([FromBody] Model.DataTransferObjects.Resource newResource)
    {
      if (newResource.Name == null)
      {
        return BadRequest("Name should be defined");
      }
      Model.Entities.Resource newItem = new() { Name = newResource.Name, Status = ResourceStatus.Active };
      await db.Resources.AddAsync(newItem);
      await db.SaveChangesAsync();
      var result = await db.Resources.SingleAsync(r => r.Name == newResource.Name);
      return Ok(Model.DataTransferObjects.Resource.FromEntity(result));
    }

    [HttpPost("update")]
    public async Task<ActionResult<Model.DataTransferObjects.Resource>> UpdateResource(Model.DataTransferObjects.Resource updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
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
      return Ok(Model.DataTransferObjects.Resource.FromEntity(existing));
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteResource(Model.DataTransferObjects.Resource deleted)
    {
      if (deleted.Id == null)
      {
        return BadRequest("deleted.id is null");
      }
      var entity = await db.Resources.SingleAsync(r => r.Id == deleted.Id);
      db.Resources.Remove(entity);
      await db.SaveChangesAsync();
      return Ok();
    }
  }
}
