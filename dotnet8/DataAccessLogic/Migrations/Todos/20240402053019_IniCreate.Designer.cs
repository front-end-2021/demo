﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Web.Api.DAL;

#nullable disable

namespace WebApiSqlite.DataAccessLogic.Migrations.Todos
{
    [DbContext(typeof(SqliteTodo))]
    [Migration("20240402053019_IniCreate")]
    partial class IniCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("todo")
                .HasAnnotation("ProductVersion", "8.0.3");

            modelBuilder.Entity("Web.Api.DAL.Goal", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Start")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Goal", "todo");
                });

            modelBuilder.Entity("Web.Api.DAL.TAction", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<long>("GoalId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Start")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GoalId");

                    b.ToTable("Action", "todo");
                });

            modelBuilder.Entity("Web.Api.DAL.TActivity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("ActionId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Start")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ActionId");

                    b.ToTable("Activity", "todo");
                });

            modelBuilder.Entity("Web.Api.DAL.Todo", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("ActionId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Start")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ActionId");

                    b.ToTable("Todo", "todo");
                });

            modelBuilder.Entity("Web.Api.DAL.UserAssign", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("AccountId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ActionIds")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("GoalIds")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("UserAssign", "todo");
                });

            modelBuilder.Entity("Web.Api.DAL.TAction", b =>
                {
                    b.HasOne("Web.Api.DAL.Goal", null)
                        .WithMany("Actions")
                        .HasForeignKey("GoalId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Web.Api.DAL.TActivity", b =>
                {
                    b.HasOne("Web.Api.DAL.TAction", null)
                        .WithMany("Activities")
                        .HasForeignKey("ActionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Web.Api.DAL.Todo", b =>
                {
                    b.HasOne("Web.Api.DAL.TAction", null)
                        .WithMany("Todos")
                        .HasForeignKey("ActionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Web.Api.DAL.Goal", b =>
                {
                    b.Navigation("Actions");
                });

            modelBuilder.Entity("Web.Api.DAL.TAction", b =>
                {
                    b.Navigation("Activities");

                    b.Navigation("Todos");
                });
#pragma warning restore 612, 618
        }
    }
}
