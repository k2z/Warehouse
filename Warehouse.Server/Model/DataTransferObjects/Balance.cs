namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Balance
  {
    public int? Id { get; set; }
    public double? Count { get; set; }
    public int? ResourceId { get; set; }
    public Resource? Resource { get; set; } = null!;
    public int? MeasureId { get; set; }
    public Measure? Measure { get; set; } = null!;
  }
}
