using AngularApp1.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model.DataTransferObjects;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("clients")]
  public class ClientsController : ControllerBase
  {

    private readonly ILogger<ClientsController> _logger;

    public ClientsController(ILogger<ClientsController> logger)
    {
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> ListAllClients()
    {
      using (var db = new DatabaseContext())
      {
        var result = await db.Clients
          .Select(c => new Client { Id = c.Id, Name = c.Name, Address = c.Address, Status = c.Status })
          .ToListAsync();
        return Ok(result);
      }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddNewClient(Client newClientData)
    {
      if (newClientData.Name == null)
      {
        return BadRequest("name is null");
      }
      using (var db = new DatabaseContext())
      {
        Model.Entities.Client newItem = new() { Name = newClientData.Name, Status = Model.Entities.ClientStatus.Active, Address = newClientData.Address };
        await db.Clients.AddAsync(newItem);
        await db.SaveChangesAsync();
        var result = await db.Clients.SingleAsync(c => c.Name == newClientData.Name);
        return Ok(result);
      }
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateClient(Client updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
      using (var db = new DatabaseContext())
      {
        var existing = db.Clients.Single(m => m.Id == updated.Id);
        if (updated.Status != null)
        {
          existing.Status = (Model.Entities.ClientStatus)updated.Status;
        }
        if (updated.Name != null)
        {
          existing.Name = updated.Name;
        }
        if (updated.Address != null)
        {
          existing.Address = updated.Address;
        }
        await db.SaveChangesAsync();
        var result = db.Measures.SingleAsync(m => m.Id == updated.Id);
        return Ok(result);
      }
    }
  }
}
