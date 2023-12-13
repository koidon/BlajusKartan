using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class moved_date_time_to_owncolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FetchedAt",
                table: "PoliceEvents");

            migrationBuilder.AddColumn<DateTime>(
                name: "EventDate",
                table: "PoliceEvents",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PoliceEvents_EventDate",
                table: "PoliceEvents",
                column: "EventDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PoliceEvents_EventDate",
                table: "PoliceEvents");

            migrationBuilder.DropColumn(
                name: "EventDate",
                table: "PoliceEvents");

            migrationBuilder.AddColumn<DateTime>(
                name: "FetchedAt",
                table: "PoliceEvents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
