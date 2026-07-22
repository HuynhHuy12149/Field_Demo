using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FieldServiceAPI.SystemAdmin.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantSchemaToSystemErrorLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TenantSchema",
                schema: "public",
                table: "SystemErrorLogs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantSchema",
                schema: "public",
                table: "SystemErrorLogs");
        }
    }
}
