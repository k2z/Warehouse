using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Resource
  {
    public int? Id { get; set; }
    public string? Name { get; set; }
    public ResourceStatus? Status { get; set; }

    public static Resource FromEntity(Model.Entities.Resource source)
    {
      return new Resource() { Id = source.Id, Name = source.Name, Status = source.Status };
    }
  }
}
