using FieldServiceAPI.Entities;
using FieldServiceAPI.DTOs.Province;
using Riok.Mapperly.Abstractions;

namespace FieldServiceAPI.Mappers
{
    [Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
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
        
    }
}
