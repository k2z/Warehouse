using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/measures")]
  public class MeasuresController : ControllerBase
  {
    private readonly DatabaseContext db;
    private readonly ILogger<MeasuresController> _logger;

    public MeasuresController(
      DatabaseContext context,
      ILogger<MeasuresController> logger
    )
    {
      this.db = context;
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Model.DataTransferObjects.Measure>>> ListAllMeasures()
    {
      var result = await db.Measures
        .Select(m => new Model.DataTransferObjects.Measure { Id = m.Id, Name = m.Name, Status = m.Status })
        .ToListAsync();
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Measure>> AddNewMeasure([FromBody] Model.DataTransferObjects.Measure newMeasure)
    {
      if (newMeasure.Name == null)
      {
        return BadRequest("Name should be defined");
      }
      Model.Entities.Measure newItem = new() { Name = newMeasure.Name, Status = MeasureStatus.Active };
      await db.Measures.AddAsync(newItem);
      await db.SaveChangesAsync();
      var result = await db.Measures.SingleAsync(m => m.Name == newMeasure.Name);
      return Ok(result);
    }

    [HttpPost("update")]
    public async Task<ActionResult<Model.DataTransferObjects.Measure>> UpdateMeasure([FromBody] Model.DataTransferObjects.Measure updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
      var existing = db.Measures.Single(m => m.Id == updated.Id);
      if (updated.Status != null)
      {
        existing.Status = (MeasureStatus)updated.Status;
      }
      if (updated.Name != null)
      {
        existing.Name = (string)updated.Name;
      }
      await db.SaveChangesAsync();
      var result = db.Measures.SingleAsync(m => m.Id == updated.Id);
      return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteMeasure(Model.DataTransferObjects.Measure deleted)
    {
      if (deleted.Id == null)
      {
        return BadRequest("deleted.id is null");
      }
      var entity = await db.Measures.SingleAsync(r => r.Id == deleted.Id);
      db.Measures.Remove(entity);
      await db.SaveChangesAsync();
      return Ok();
    }
  }
}
