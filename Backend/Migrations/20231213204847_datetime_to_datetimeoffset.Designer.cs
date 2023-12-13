﻿// <auto-generated />
using System;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20231213204847_datetime_to_datetimeoffset")]
    partial class datetime_to_datetimeoffset
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.PoliceEventEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset?>("EventDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("EventDate");

                    b.ToTable("PoliceEvents");
                });

            modelBuilder.Entity("Backend.Models.PoliceEventEntity", b =>
                {
                    b.OwnsOne("Backend.Dtos.PoliceEventDto", "PoliceEvent", b1 =>
                        {
                            b1.Property<int>("PoliceEventEntityId")
                                .HasColumnType("int");

                            b1.Property<int>("Id")
                                .HasColumnType("int");

                            b1.Property<string>("Name")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Summary")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Type")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Url")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("PoliceEventEntityId");

                            b1.ToTable("PoliceEvents");

                            b1.ToJson("PoliceEvent");

                            b1.WithOwner()
                                .HasForeignKey("PoliceEventEntityId");

                            b1.OwnsOne("Backend.Dtos.Location", "Location", b2 =>
                                {
                                    b2.Property<int>("PoliceEventDtoPoliceEventEntityId")
                                        .HasColumnType("int");

                                    b2.Property<string>("Gps")
                                        .IsRequired()
                                        .HasColumnType("nvarchar(max)");

                                    b2.Property<string>("Name")
                                        .IsRequired()
                                        .HasColumnType("nvarchar(max)");

                                    b2.HasKey("PoliceEventDtoPoliceEventEntityId");

                                    b2.ToTable("PoliceEvents");

                                    b2.WithOwner()
                                        .HasForeignKey("PoliceEventDtoPoliceEventEntityId");
                                });

                            b1.Navigation("Location")
                                .IsRequired();
                        });

                    b.Navigation("PoliceEvent")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
