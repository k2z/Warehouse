using System.Linq.Expressions;
using System.Reflection;

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
                  _ when propertyType == typeof(DateOnly) => Expression.Constant(filter.DateValue),
                  _ => throw new ArgumentOutOfRangeException()
                };
                var expression = Expression.Equal(member, constant);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.In:
              {
                var containsMethod = propertyType switch
                {
                  _ when propertyType == typeof(string) => Utils.ContainsMethod<string>(),
                  _ when propertyType == typeof(int) => Utils.ContainsIntMethod(),
                  _ => throw new ArgumentOutOfRangeException()
                };
                var arrayConstant = propertyType switch
                {
                  _ when propertyType == typeof(string) => Expression.Constant(filter.Values),
                  _ when propertyType == typeof(int) => Expression.Constant(filter.NumberValues),
                  _ => throw new ArgumentOutOfRangeException()
                };
                var expression = Expression.Call(containsMethod, arrayConstant, member);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.LessThan:
              {
                var constant = Expression.Constant(filter.DateValue);
                var expression = Expression.LessThan(member, constant);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.MoreThan:
              {
                var constant = Expression.Constant(filter.DateValue);
                var expression = Expression.LessThan(constant, member);
                expressionBody = expressionBody == null ? expression : Expression.AndAlso(expressionBody, expression);
                break;
              }
              case FilteringType.NotEqual:
              {
                var constant = Expression.Constant(filter.DateValue);
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

    private static MethodInfo ContainsMethod<T>() where T : class
    {
      Expression<Func<IEnumerable<T>, bool>> containsExpression = (IEnumerable<T> q) => q.Contains((T)null);
      return (containsExpression.Body as MethodCallExpression).Method;
    }
    
    private static MethodInfo ContainsIntMethod()
    {
      Expression<Func<IEnumerable<int>, bool>> containsExpression = (IEnumerable<int> q) => q.Contains(0);
      return (containsExpression.Body as MethodCallExpression).Method;
    }
  }
}
