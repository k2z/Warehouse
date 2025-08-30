namespace Warehouse.Server.Model.Entities
{
  public class IncomeResource: IDocumentItem
  {
    public int Id { get; set; }
    public double Count { get; set; }
    public int IncomeId { get; set; }
    public Income? Income { get; set; }
    public int ResourceId { get; set; }
    public Resource Resource { get; set; } = null!;
    public int MeasureId { get; set; }
    public Measure Measure { get; set; } = null!;
  }
}
