namespace FieldServiceAPI.DTOs.Province
{
    public class DistrictResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        
        // Thuộc tính này sẽ được Mapperly TỰ ĐỘNG map từ District.Province.Name
        // nhờ tính năng Flattening (ghép tên Province + Name)
        public string ProvinceName { get; set; } = default!;
    }
}
