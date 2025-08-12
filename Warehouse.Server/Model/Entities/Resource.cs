namespace Warehouse.Server.Model.Entities
{

  public enum ResourceStatus
  {
    Active = 0,
    Archived = 1,
    Deleted = 2,
  }

  public class Resource
  {
    public int Id { get; set; }
    public required string Name { get; set; }
    public ResourceStatus Status { get; set; }

    public IEnumerable<Balance> Balances { get; set; } = null!;
    public IEnumerable<IncomeResource> IncomeResources { get; set; } = null!;
    public IEnumerable<ShipmentResource> ShipmentResources { get; set; } = null!;
  }
}
