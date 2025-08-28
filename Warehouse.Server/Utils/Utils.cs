using System.Linq.Expressions;

namespace Warehouse.Server.Utils
{
  public class Utils
  {
    public static string FirstCharToUpper(string source)
    {
      if (string.IsNullOrEmpty(source))
      {
        return string.Empty;
      }
      return char.ToUpper(source[0]) + source.Substring(1);
    }

    public static readonly List<string> SpecificFilterFields = ["includingResources", "includingMeasures"];

    public static Expression<Func<T, bool>> ParseFilterExpression<T>(IEnumerable<FilteringData> filters)
    {
      if (filters?.Any() != true)
      {
        return x => true;
      }
      var param = Expression.Parameter(typeof(T), "x");
      Expression? expressionBody = null;
      foreach (var filter in filters)
      {
        if (string.IsNullOrEmpty(filter.Field))
        {
          continue;
        }
        switch (filter.Field)
        {
          case "includingResources":
            // skip
            break;
          case "includingMeasures":
            // skip
            break;
          default:
          {
            var propertyName = Utils.FirstCharToUpper(filter.Field);
            var property = typeof(T).GetProperty(propertyName);
            var propertyType = property?.PropertyType;
            Expression member;
            try
            {
              member = Expression.Property(param, propertyName);
            }
            catch (ArgumentException)
            {
              continue;
            }

            switch (filter.MatchType)
            {
              case FilteringType.Equals:
              {
                var constant = propertyType switch
                {
                  _ when propertyType == typeof(string) => Expression.Constant(filter.Value),
                  _ when propertyType == typeof(DateTime) => Expression.Constant(filter.DateValue.HasValue
                    ? DateOnly.FromDateTime(filter.DateValue.Value)
                    : null),
                  _ => throw new ArgumentOutOfRangeException()
                };
                var expression = Expression.Equal(member, constant);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.In:
              {
                Expression<Func<IEnumerable<string>, bool>> containsExpression =
                  (IEnumerable<string> q) => q.Contains((string)null);
                var containsMethod = (containsExpression.Body as MethodCallExpression).Method;
                var arrayConstant = Expression.Constant(filter.Values);
                var expression = Expression.Call(containsMethod, arrayConstant, member);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.LessThan:
              {
                var constant = Expression.Constant(filter.DateValue.HasValue
                  ? DateOnly.FromDateTime(filter.DateValue.Value)
                  : null);
                var expression = Expression.LessThan(member, constant);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.MoreThan:
              {
                var constant = Expression.Constant(filter.DateValue.HasValue
                  ? DateOnly.FromDateTime(filter.DateValue.Value)
                  : null);
                var expression = Expression.LessThan(constant, member);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.NotEqual:
              {
                var constant = Expression.Constant(filter.DateValue.HasValue
                  ? DateOnly.FromDateTime(filter.DateValue.Value)
                  : null);
                var expression = Expression.NotEqual(constant, member);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              default:
                throw new ArgumentOutOfRangeException();
            };
            break;
          }
        };
      }
      return Expression.Lambda<Func<T, bool>>(expressionBody, param);
    }
  }
}
