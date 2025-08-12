namespace Warehouse.Server.Model.Entities
{
  public class ShipmentResource
  {
    public int Id { get; set; }
    public double Count { get; set; }
    public int ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;
    public int ResourceId { get; set; }
    public Resource Resource { get; set; } = null!;
    public int MeasureId { get; set; }
    public Measure Measure { get; set; } = null!;
  }
}
