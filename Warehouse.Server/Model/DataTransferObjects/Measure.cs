using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Measure
  {
    public int? Id { get; set; }
    public string? Name { get; set; }
    public MeasureStatus? Status { get; set; }
  }
}
