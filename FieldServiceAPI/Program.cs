using FieldServiceAPI.Extensions;
using FieldServiceAPI.Tenant.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args
});

// Chỉ load config, không watch file
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
// SwaggerGen đã được chuyển vào AddApplicationServices trong DependencyInjection.cs

var app = builder.Build();

// Tạo Scope để áp dụng migrations (nếu có) rồi chạy hàm Seed
using (var scope = app.Services.CreateScope())
{
    try
    {
        var sysDb = scope.ServiceProvider.GetRequiredService<FieldServiceAPI.SystemAdmin.Data.SystemDbContext>();
        
        await sysDb.Database.MigrateAsync();
        
        // Cố tình bỏ qua việc Migrate AppDbContext ở đây
        // Vì AppDbContext (dữ liệu Tenant) chỉ được Migrate khi có một Tenant mới được tạo
        // Xem SystemTenantService.CreateTenantAsync
    }
    catch (Exception ex)
    {
        // Không dừng app nếu migration thất bại ở môi trường dev, ghi log vào console
        Console.WriteLine($"Warning: failed to apply migrations: {ex.Message}");
        
        try 
        {
            var errorLogService = scope.ServiceProvider.GetRequiredService<FieldServiceAPI.Tenant.Services.Common.SystemErrorLogService>();
            await errorLogService.LogErrorAsync(ex, "Program.MigrateAsync");
        }
        catch { }
    }
}

// Swagger dev only
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseCors("AllowAll");
app.UseHttpsRedirection();

// Thêm Middleware Authentication TRƯỚC Authorization
app.UseAuthentication();
app.UseAuthorization();

// Middleware hỗ trợ định tuyến file tĩnh cho Next.js (cả dạng .html và /index.html)
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;
    if (!string.IsNullOrEmpty(path) && !path.StartsWith("/api"))
    {
        var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var cleanPath = path.TrimStart('/').TrimEnd('/');

        if (string.IsNullOrEmpty(cleanPath))
        {
            await next();
            return;
        }

        if (!Path.HasExtension(path))
        {
            if (File.Exists(Path.Combine(webRoot, cleanPath + ".html")))
            {
                context.Request.Path = "/" + cleanPath + ".html";
            }
            else if (File.Exists(Path.Combine(webRoot, cleanPath, "index.html")))
            {
                context.Request.Path = "/" + cleanPath + "/index.html";
            }
        }
    }
    await next();
});

// Phục vụ file tĩnh từ wwwroot (thư mục build của Next.js)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
// Static export: mỗi trang có file HTML riêng, không cần SPA fallback về index.html
// Dùng 404.html để tránh bị redirect nhầm về trang Tenant
app.MapFallbackToFile("404.html");

// Lấy port từ Render (hoặc HuggingFace)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run();
