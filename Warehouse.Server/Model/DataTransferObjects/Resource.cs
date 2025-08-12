using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Resource
  {
    public int? Id { get; set; }
    public string? Name { get; set; }
    public ResourceStatus? Status { get; set; }
  }
}
