namespace Warehouse.Server.Model.Entities
{
  public enum ClientStatus
  {
    Active = 0,
    Suspended = 1,
    Deleted = 2,
  }

  public class Client
  {
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Address { get; set; }
    public ClientStatus Status { get; set; }
  }
}
