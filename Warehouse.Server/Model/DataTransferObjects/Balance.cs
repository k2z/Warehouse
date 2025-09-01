namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Balance
  {
    public int? Id { get; set; }
    public double? Count { get; set; }
    public int? ResourceId { get; set; }
    public string? Resource { get; set; }
    public int? MeasureId { get; set; }
    public string? Measure { get; set; }
  }
}
