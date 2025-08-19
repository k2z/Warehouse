using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Client
  {
    public int? Id { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
    public ClientStatus? Status { get; set; }

    public static Client FromEntity(Model.Entities.Client source)
    {
      return new Client { Id = source.Id, Name = source.Name, Address = source.Address, Status = source.Status };
    }
  }
}
