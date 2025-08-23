namespace Warehouse.Server.Model.DataTransferObjects
{
  public class IncomeResource
  {
    public int? Id { get; set; }
    public double? Count { get; set; }
    public string? Resource { get; set; }
    public int? ResourceId { get; set; }
    public string? Measure { get; set; }
    public int? MeasureId { get; set; }
  }

  public class Income
  {
    public int? Id { get; set; }
    public string? Number { get; set; }
    public DateOnly? Date { get; set; }
    public IEnumerable<IncomeResource>? Items { get; set; }

    public static Income FromEntity(Model.Entities.Income source)
    {
      var result = new Income
      {
        Id = source.Id,
        Number = source.Number,
        Date = source.Date,
        Items = source.IncomeResources.Select((ir) =>
        {
          return new IncomeResource
          {
            Id = ir.Id,
            Count = ir.Count,
            Measure = ir.Measure.Name,
            MeasureId = ir.MeasureId,
            Resource = ir.Resource.Name,
            ResourceId = ir.ResourceId
          };
        }).ToList()
      };
      return result;
    }
  }
}
