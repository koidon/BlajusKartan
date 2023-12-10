﻿// <auto-generated />
using System;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Book", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("Backend.Models.PoliceEventEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("FetchedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("PoliceEvents");
                });

            modelBuilder.Entity("Backend.Models.PoliceEventEntity", b =>
                {
                    b.OwnsOne("Backend.Models.PoliceEvent", "PoliceEvent", b1 =>
                        {
                            b1.Property<int>("PoliceEventEntityId")
                                .HasColumnType("int");

                            b1.Property<string>("Datetime")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

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

                            b1.OwnsOne("Backend.Models.Location", "Location", b2 =>
                                {
                                    b2.Property<int>("PoliceEventEntityId")
                                        .HasColumnType("int");

                                    b2.Property<string>("Gps")
                                        .IsRequired()
                                        .HasColumnType("nvarchar(max)");

                                    b2.Property<string>("Name")
                                        .IsRequired()
                                        .HasColumnType("nvarchar(max)");

                                    b2.HasKey("PoliceEventEntityId");

                                    b2.ToTable("PoliceEvents");

                                    b2.WithOwner()
                                        .HasForeignKey("PoliceEventEntityId");
                                });

                            b1.InfoPanel("Location")
                                .IsRequired();
                        });

                    b.InfoPanel("PoliceEvent")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
