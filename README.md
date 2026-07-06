---
title: FieldServiceAPI
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# FieldServiceAPI

Dự án Web API được xây dựng trên nền tảng **ASP.NET Core 9.0** sử dụng **Entity Framework Core** và **PostgreSQL**.

## 🚀 Hướng dẫn Cài đặt & Chạy Dự án

### 1. Yêu cầu hệ thống
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [PostgreSQL](https://www.postgresql.org/download/)
- IDE khuyên dùng: Visual Studio 2022, Rider, hoặc Visual Studio Code.

### 2. Cấu hình Chuỗi kết nối (Connection String)
Mở file `appsettings.json` hoặc `appsettings.Development.json` (nằm trong thư mục `FieldServiceAPI`) và cấu hình chuỗi kết nối tới database PostgreSQL của bạn:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=FieldServiceDB;Username=postgres;Password=mat_khau_cua_ban"
  }
}
```

### 3. Cài đặt các thư viện cần thiết
Dự án đã sử dụng sẵn các thư viện (được cấu hình trong `.csproj`). Nếu bạn clone project về, chỉ cần chạy lệnh sau tại thư mục chứa file `.csproj` để khôi phục (restore) các thư viện:
```bash
dotnet restore
```

Các thư viện chính đang sử dụng và lệnh cài đặt (nếu bạn tự build lại dự án từ đầu):

```bash
# 1. Entity Framework Core & Driver kết nối PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# 2. Thư viện Map Dữ liệu tự động (Nhanh nhất hiện tại)
dotnet add package Riok.Mapperly

# 3. Thư viện kết nối Supabase (Tuỳ chọn nếu xài Storage, Auth của họ)
dotnet add package Supabase
dotnet add package Supabase.Postgrest

# 4. Swagger (Tạo tài liệu API - Thường có sẵn khi tạo project WebAPI)
dotnet add package Swashbuckle.AspNetCore
```

### 4. Khởi chạy dự án
Di chuyển vào thư mục chứa file `.csproj`:
```bash
cd FieldServiceAPI
```

Chạy lệnh sau để khởi động server:
```bash
dotnet run
```
Hoặc chạy ở chế độ tự động reload (hot reload) khi có thay đổi code:
```bash
dotnet watch run
```
Sau khi chạy, truy cập Swagger UI để test API tại URL (port có thể khác tùy máy): `http://localhost:<port>/swagger`

---

## 🗄️ Hướng dẫn Quản lý Database (Entity Framework Core)

### 1. Thêm mới một Migration (Thêm DB)
Khi bạn có thay đổi ở các class `Entity` (ví dụ thêm bảng, sửa cột) và muốn áp dụng vào database, hãy chạy lệnh sau:
```bash
dotnet ef migrations add <Ten_Cua_Migration>
```
*Ví dụ: `dotnet ef migrations add InitialCreate`*

### 2. Cập nhật Database (Update DB)
Sau khi tạo migration, bạn cần đẩy nó xuống database thực tế:
```bash
dotnet ef database update
```

### 3. Rollback (Quay lại Migration cũ)
Nếu bạn lỡ `update` DB nhưng phát hiện code bị lỗi hoặc thiết kế sai, bạn có thể quay ngược lại một migration trước đó:
```bash
dotnet ef database update <Ten_Migration_Muon_Quay_Ve>
```
*Lưu ý: Nếu bạn muốn xóa toàn bộ scheme để làm lại từ đầu, dùng lệnh: `dotnet ef database update 0`*

Sau khi đã update DB lùi về bản cũ, bạn có thể xóa file migration bị sai vừa tạo ra bằng lệnh:
```bash
dotnet ef migrations remove
```

---

## 🛠️ Đăng ký Services & Kiến trúc

### Đăng ký Service ở đâu?
Tất cả các Service (Business Logic) và các cấu hình Dependency Injection (DI) đều được đăng ký tại file **`Program.cs`**.

Ví dụ cách bạn đang đăng ký:
```csharp
// 1. Đăng ký Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2. Đăng ký Business Services (như ProvinceService)
builder.Services.AddScoped<ProvinceService>();
```

---

## 🔄 Hướng dẫn Map dữ liệu (Mapperly)

Dự án sử dụng **Mapperly** để tự động map dữ liệu giữa Entity và DTO. Mapperly sinh ra code lúc biên dịch (Compile-time) nên tốc độ cực kỳ nhanh.

### 1. Tự động Map Khóa ngoại (Flattening)
Nếu bảng `District` có khóa ngoại `Province`, và bạn muốn lấy `Name` của `Province` ra DTO:
Chỉ cần đặt tên thuộc tính ở DTO là `ProvinceName` (ghép `Province` + `Name`). Mapperly sẽ **tự động chui vào** `District.Province.Name` để lấy dữ liệu.

```csharp
// Trong DistrictResponse.cs
public class DistrictResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    
    // TỰ ĐỘNG LẤY TỪ Province.Name
    public string ProvinceName { get; set; } = default!;
}
```

### 2. Custom Mapping (Tự định nghĩa tên)
Nếu bạn không thích tên `ProvinceName` mà muốn đặt tên DTO là `ProvinceNewName` (hoặc tên bất kỳ):
Thêm Attribute `[MapProperty("Source", "Target")]` vào trên hàm Map.

```csharp
// Trong Mappers/GlobalMapper.cs
[Mapper]
public static partial class GlobalMapper
{
    // Lấy Province.Name đắp vào ProvinceNewName
    [MapProperty("Province.Name", "ProvinceNewName")]
    public static partial DistrictResponse ToDTO(this District district);

    [MapProperty("Province.Name", "ProvinceNewName")]
    public static partial IQueryable<DistrictResponse> ProjectToDTO(this IQueryable<District> query);
}
```

### 3. Tối ưu hóa với Entity Framework
Bạn **không cần** gọi `.Include()` khi dùng `ProjectToDTO()`. Entity Framework và Mapperly sẽ tự động dịch ra câu lệnh `SQL LEFT JOIN` và chỉ `SELECT` đúng những cột bạn cần!

```csharp
// Cách dùng trong Service
public async Task<List<DistrictResponse>> GetAllAsync()
{
    return await _context.Districts
        .ProjectToDTO() // Tự động Map và Join!
        .ToListAsync();
}
```