using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model;
using Warehouse.Server.Model.DataTransferObjects;

namespace Warehouse.Server.Controllers
{
  [ApiController]
  [Route("api/clients")]
  public class ClientsController : ControllerBase
  {

    private readonly DatabaseContext db;
    private readonly ILogger<ClientsController> _logger;

    public ClientsController(
      DatabaseContext context,
      ILogger<ClientsController> logger
    )
    {
      this.db = context;
      _logger = logger;
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Model.DataTransferObjects.Client>>> ListAllClients()
    {
      var result = await db.Clients
        .Select(c => new Client { Id = c.Id, Name = c.Name, Address = c.Address, Status = c.Status })
        .ToListAsync();
      return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Model.DataTransferObjects.Client>> AddNewClient([FromBody] Model.DataTransferObjects.Client newClientData)
    {
      if (newClientData.Name == null)
      {
        return BadRequest("name is null");
      }
      Model.Entities.Client newItem = new() { Name = newClientData.Name, Status = Model.Entities.ClientStatus.Active, Address = newClientData.Address };
      await db.Clients.AddAsync(newItem);
      await db.SaveChangesAsync();
      var result = await db.Clients.SingleAsync(c => c.Name == newClientData.Name);
      return Ok(Client.FromEntity(result));
    }

    [HttpPost("update")]
    public async Task<ActionResult<Model.DataTransferObjects.Client>> UpdateClient([FromBody] Model.DataTransferObjects.Client updated)
    {
      if (updated.Id == null)
      {
        return BadRequest("updated.id is null");
      }
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
      var result = await db.Clients.SingleAsync(m => m.Id == updated.Id);
      return Ok(Client.FromEntity(result));
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteClient(Model.DataTransferObjects.Client deleted)
    {
      if (deleted.Id == null)
      {
        return BadRequest("deleted.id is null");
      }
      var entity = await db.Clients.SingleAsync(r => r.Id == deleted.Id);
      db.Clients.Remove(entity);
      await db.SaveChangesAsync();
      return Ok();
    }
  }
}
