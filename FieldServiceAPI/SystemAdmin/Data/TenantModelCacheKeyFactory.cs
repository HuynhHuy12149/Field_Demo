using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.SystemAdmin.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace FieldServiceAPI.SystemAdmin.Data
{
    public class TenantModelCacheKeyFactory : IModelCacheKeyFactory
    {
        public object Create(DbContext context, bool designTime)
        {
            if (context is AppDbContext appContext)
            {
                return (context.GetType(), appContext.CurrentSchema ?? "public", designTime);
            }
            return (context.GetType(), designTime);
        }
    }
}
