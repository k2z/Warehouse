using System.Text.Json;
using System.Text.Json.Serialization;

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

    [JsonPropertyName("field")]
    public string? Field { get; set; }

    [JsonPropertyName("matchType")]
    public FilteringType MatchType { get; set; }

    [JsonPropertyName("value")]
    public string? Value { get; set; }

    [JsonPropertyName("values")]
    public IEnumerable<string>? Values { get; set; }
    
    [JsonPropertyName("numberValues")]
    public IEnumerable<int>? NumberValues { get; set; }

    [JsonPropertyName("dateValue")]
    public DateTime? DateValue { get; set; }

    public static bool TryParse(string value, out FilteringData result)
    {
      var deserialized = JsonSerializer.Deserialize<FilteringData>(value);
      if (deserialized != null)
      {
        result = deserialized;
        return true;
      }
      result = new FilteringData();
      return false;
    }
  }
}
