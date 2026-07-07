using System;

namespace FieldServiceAPI.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Chuẩn hóa chuỗi tìm kiếm (xóa khoảng trắng thừa và chuyển về chữ thường)
        /// </summary>
        public static string NormalizeSearch(this string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;
                
            return input.Trim().ToLower();
        }
    }
}
