namespace FieldServiceAPI.Tenant.DTOs.Base
{
    public class PagedRequest
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; } // "asc" or "desc"
    }
}
