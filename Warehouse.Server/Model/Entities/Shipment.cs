namespace Warehouse.Server.Model.Entities
{
  public enum ShipmentState
  {
    Created = 0,
    Signed = 1,
    Rejected = 2,
  }

  public class Shipment
  {
    public int Id { get; set; }
    public required string Number { get; set; }
    public DateOnly Date { get; set; }
    public ShipmentState State { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
    public ICollection<ShipmentResource> ShipmentResources { get; set; } = new List<ShipmentResource>();
  }
}
