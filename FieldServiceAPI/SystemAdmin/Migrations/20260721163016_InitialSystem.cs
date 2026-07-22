using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FieldServiceAPI.SystemAdmin.Migrations
{
    /// <inheritdoc />
    public partial class InitialSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Email",
                value: "superadmin@gmail.com");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Email",
                value: "superadmin@fieldservice.com");
        }
    }
}
