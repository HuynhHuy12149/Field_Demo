using FieldServiceAPI.Entities;
using FieldServiceAPI.DTOs.Province;
using Riok.Mapperly.Abstractions;
#pragma warning disable RMG012

namespace FieldServiceAPI.Mappers
{
    [Mapper]
    public static partial class GlobalMapper
    {
        // ----------------------------------------------------
        // 1. Nhóm Mapping cho PROVINCE
        // ----------------------------------------------------
        public static partial ProvinceResponse ToDTO(this Province province);
        public static partial Province ToEntity(this ProvinceResponse provinceResponse);
        public static partial IQueryable<ProvinceResponse> ProjectToDTO(this IQueryable<Province> query);

        // ----------------------------------------------------
        // 2. Nhóm Mapping cho DISTRICT
        // ----------------------------------------------------
        public static partial DistrictResponse ToDTO(this District district);
        public static partial District ToEntity(this DistrictResponse districtResponse);
        public static partial IQueryable<DistrictResponse> ProjectToDTO(this IQueryable<District> query);

        // ----------------------------------------------------
        // 3. Nhóm Mapping cho ROLE
        // ----------------------------------------------------
        public static partial FieldServiceAPI.DTOs.Role.RoleResponse ToDTO(this Role role);
        public static partial Role ToEntity(this FieldServiceAPI.DTOs.Role.RoleRequest roleRequest);
        public static partial IQueryable<FieldServiceAPI.DTOs.Role.RoleResponse> ProjectToDTO(this IQueryable<Role> query);
        public static partial void UpdateEntity(this FieldServiceAPI.DTOs.Role.RoleRequest request, Role entity);
        // ----------------------------------------------------
        // 4. Nhóm Mapping cho USER
        // ----------------------------------------------------
        public static partial FieldServiceAPI.DTOs.Users.UserResponse ToDTO(this User user);
        public static partial User ToEntity(this FieldServiceAPI.DTOs.Users.UserRequest userRequest);
        public static partial IQueryable<FieldServiceAPI.DTOs.Users.UserResponse> ProjectToDTO(this IQueryable<User> query);
        public static partial void UpdateEntity(this FieldServiceAPI.DTOs.Users.UserRequest request, User entity);
    }
}
