using AngularApp1.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("measures")]
  public class MeasuresController : ControllerBase
  {

    private readonly ILogger<MeasuresController> _logger;

    public MeasuresController(ILogger<MeasuresController> logger)
    {
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> ListAllMeasures()
    {
      using (var db = new DatabaseContext())
      {
        var result = await db.Measures
          .Select(m => new Model.DataTransferObjects.Measure { Id = m.Id, Name = m.Name, Status = m.Status })
          .ToListAsync();
        return Ok(result);
      }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddNewMeasure(string name)
    {
      using (var db = new DatabaseContext())
      {
        Model.Entities.Measure newItem = new() { Name = name, Status = MeasureStatus.Active };
        await db.Measures.AddAsync(newItem);
        await db.SaveChangesAsync();
        var result = await db.Measures.SingleAsync(m => m.Name == name);
        return Ok(result);
      }
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateMeasure(Model.DataTransferObjects.Measure updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
      using (var db = new DatabaseContext())
      {
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
    }
  }
}
