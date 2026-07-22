namespace FieldServiceAPI.SystemAdmin.DTOs.Base
{
    public class SystemPagedRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool IsDescending { get; set; } = true;
    }
}
