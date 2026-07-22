using FieldServiceAPI.SystemAdmin.Data;
using FieldServiceAPI.SystemAdmin.Services;
using FieldServiceAPI.SystemAdmin.Services.SystemErrorLog;
using FieldServiceAPI.Tenant.Data;
using FieldServiceAPI.Tenant.Services.Auth;
using FieldServiceAPI.Tenant.Services.Common;
using FieldServiceAPI.Tenant.Services.Role;
using FieldServiceAPI.Tenant.Services.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace FieldServiceAPI.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. Đăng ký Database Context
            services.AddDbContext<SystemDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
            );

            services.AddScoped<ITenantService, TenantService>();
            services.AddScoped<ISystemAuthService, SystemAuthService>();
            services.AddScoped<ISystemTenantService, SystemTenantService>();
            services.AddScoped<ISystemErrorLogQueryService, SystemErrorLogQueryService>();

            services.AddDbContext<AppDbContext>((sp, options) =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var tenantService = sp.GetRequiredService<ITenantService>();
                var schema = tenantService.GetCurrentTenantSchema() ?? "public";

                var connectionString = configuration.GetConnectionString("DefaultConnection");
                var builder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString)
                {
                    SearchPath = schema
                };

                options.UseNpgsql(builder.ConnectionString, npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", schema);
                });
                options.ReplaceService<IModelCacheKeyFactory, TenantModelCacheKeyFactory>();
            });

            // 2. Đăng ký các Business Services
            services.AddScoped<FieldServiceAPI.Tenant.Services.User.UserService>();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<FieldServiceAPI.Tenant.Services.Auth.AuthService>();
            services.AddScoped<FieldServiceAPI.Tenant.Services.Role.RoleService>();
            services.AddScoped<SystemErrorLogService>();

            // 3. Đăng ký JWT Authentication
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey!))
                };
                
                options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"[JWT Error] Authentication failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine($"[JWT Info] Token validated successfully for user: {context.Principal?.Identity?.Name}");
                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        Console.WriteLine($"[JWT Info] Challenge issued. Error: {context.Error}, ErrorDescription: {context.ErrorDescription}");
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("SuperAdmin", policy => 
                    policy.RequireClaim("UserType", "SuperAdmin"));
            });

            // 4. Cấu hình Swagger hỗ trợ JWT
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "FieldServiceAPI", Version = "v1" });

                // Nút Authorize
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "Nhập Token vào đây theo format: Bearer {token}",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                        },
                        new System.Collections.Generic.List<string>()
                    }
                });
            });

            return services;
        }
    }
}
