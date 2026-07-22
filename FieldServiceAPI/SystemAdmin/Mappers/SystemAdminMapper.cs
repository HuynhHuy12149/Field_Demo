using Riok.Mapperly.Abstractions;
using FieldServiceAPI.SystemAdmin.Entities;
using FieldServiceAPI.SystemAdmin.DTOs.SystemErrorLogs;

namespace FieldServiceAPI.SystemAdmin.Mappers
{
    [Mapper]
    public static partial class SystemAdminMapper
    {
        public static partial SystemErrorLogResponse ToResponse(this SystemErrorLog log);
    }
}
