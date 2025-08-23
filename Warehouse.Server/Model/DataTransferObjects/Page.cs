namespace Warehouse.Server.Model.DataTransferObjects
{
  public class Page<TItem>
  {
    public int? Count { get; set; }
    public IEnumerable<TItem>? Items { get; set; }
  }
}
