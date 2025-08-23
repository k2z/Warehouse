namespace Warehouse.Server.Utils
{
  public enum FilteringType
  {
    Exact,
    Daterange,
    Multiple,
    // TODO
  }

  public class FilteringData
  {
    FilteringType type { get; set; }
    DateTime? from { get; set; }
    DateTime? to { get; set; }
    string? value { get; set; }
    IEnumerable<string>? values { get; set; }
  }

  public class GridFilter
  {
    // TODO public static TryParse
    // TODO Support Typescript equivalent for:
    /*
    filters?: {
        [s: string]: FilterMetadata | FilterMetadata[] | undefined;
    };

    interface FilterMetadata {
      value?: any;
      matchMode?: string;
      operator?: string;
    }
    */
    Dictionary<string, IEnumerable<FilteringData>>? FieldFilterings { get; set; }

    public static bool TryParse(string value, out GridFilter result)
    {
      result = new GridFilter { FieldFilterings = new Dictionary<string, IEnumerable<FilteringData>>() };
      return true;
    }
  }
}
