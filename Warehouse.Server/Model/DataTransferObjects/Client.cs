using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Client
  {
    public int? Id { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
    public ClientStatus? Status { get; set; }
  }
}
