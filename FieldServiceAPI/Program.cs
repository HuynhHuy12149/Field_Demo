using FieldServiceAPI.Extensions;

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

// Tạo Scope để lấy AuthService và chạy hàm Seed
using (var scope = app.Services.CreateScope())
{
    var authService = scope.ServiceProvider.GetRequiredService<FieldServiceAPI.Services.Auth.AuthService>();
    await authService.SeedAdminUserAsync();
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

// Phục vụ file tĩnh từ wwwroot (thư mục build của Next.js)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToFile("index.html");

// Lấy port từ Render (hoặc HuggingFace)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run();
