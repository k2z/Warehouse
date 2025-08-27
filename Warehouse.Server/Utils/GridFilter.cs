namespace Warehouse.Server.Utils
{
  public enum FilteringType
  {
    Equals = 0,
    In = 1,
    MoreThan = 2,
    LessThan = 3,
    NotEqual = 4,
  }

  public class FilteringData
  {
    string? Field { get; set; }
    FilteringType MatchType { get; set; }
    string? value { get; set; }
    IEnumerable<string>? values { get; set; }
    DateTime? dateValue { get; set; }
  }
}
