using FieldServiceAPI.Tenant.Entities;
using Riok.Mapperly.Abstractions;
#pragma warning disable RMG012

namespace FieldServiceAPI.Tenant.Mappers
{
    [Mapper]
    public static partial class TenantMapper
    {
        // ----------------------------------------------------
        // 3. Nhóm Mapping cho ROLE
        // ----------------------------------------------------
        public static partial FieldServiceAPI.Tenant.DTOs.Role.RoleResponse ToDTO(this Role role);
        public static partial Role ToEntity(this FieldServiceAPI.Tenant.DTOs.Role.RoleRequest roleRequest);
        public static partial IQueryable<FieldServiceAPI.Tenant.DTOs.Role.RoleResponse> ProjectToDTO(this IQueryable<Role> query);
        public static partial void UpdateEntity(this FieldServiceAPI.Tenant.DTOs.Role.RoleRequest request, Role entity);
        // ----------------------------------------------------
        // 4. Nhóm Mapping cho USER
        // ----------------------------------------------------
        public static partial FieldServiceAPI.Tenant.DTOs.Users.UserResponse ToDTO(this User user);
        public static partial User ToEntity(this FieldServiceAPI.Tenant.DTOs.Users.UserRequest userRequest);
        public static partial IQueryable<FieldServiceAPI.Tenant.DTOs.Users.UserResponse> ProjectToDTO(this IQueryable<User> query);
        public static partial void UpdateEntity(this FieldServiceAPI.Tenant.DTOs.Users.UserRequest request, User entity);
    }
}
