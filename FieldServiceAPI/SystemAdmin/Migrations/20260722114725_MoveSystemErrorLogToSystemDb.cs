using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FieldServiceAPI.SystemAdmin.Migrations
{
    /// <inheritdoc />
    public partial class MoveSystemErrorLogToSystemDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemErrorLogs",
                schema: "public");

            migrationBuilder.CreateTable(
                name: "SystemErrorLogs",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    StackTrace = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemErrorLogs", x => x.Id);
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$auPbtJiBd77yD9xrH65jwO1HSE.BpYd7GhE8CE9qlgqKK.NdDgLqW");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemErrorLogs",
                schema: "public");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "SystemUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$VyeizmsIJwh4PVKBi0zxNe99dsrYC8OfTQUt/.PyI.OzHYbB00h9O");
        }
    }
}
