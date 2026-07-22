using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FieldServiceAPI.SystemAdmin.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$VyeizmsIJwh4PVKBi0zxNe99dsrYC8OfTQUt/.PyI.OzHYbB00h9O");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$WKsqj.tcLGXajtqyD25dxea44MIIeO2VvOMvj1qKueE1fiaSPt09q");
        }
    }
}
