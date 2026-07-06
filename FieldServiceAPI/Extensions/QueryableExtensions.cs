using System.Linq.Expressions;

namespace FieldServiceAPI.Extensions;

public static class QueryableExtensions
{
    /// <summary>
    /// Filters a query based on a predicate if the condition is true.
    /// </summary>
    public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    /// <summary>
    /// Sorts a query dynamically based on column name and sort order ("asc" or "desc").
    /// </summary>
    public static IQueryable<T> OrderByDynamic<T>(this IQueryable<T> query, string? sortColumn, string? sortOrder)
    {
        if (string.IsNullOrWhiteSpace(sortColumn))
            return query;

        var entityType = typeof(T);
        var propertyInfo = entityType.GetProperty(sortColumn, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
        
        if (propertyInfo == null)
            return query;

        var parameter = Expression.Parameter(entityType, "x");
        var propertyAccess = Expression.MakeMemberAccess(parameter, propertyInfo);
        var orderByExpression = Expression.Lambda(propertyAccess, parameter);

        var methodName = (sortOrder?.ToLower() == "desc") ? "OrderByDescending" : "OrderBy";
        
        var resultExpression = Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { entityType, propertyInfo.PropertyType },
            query.Expression,
            Expression.Quote(orderByExpression));

        return query.Provider.CreateQuery<T>(resultExpression);
    }
}
