using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<PoliceEventEntity> PoliceEvents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PoliceEventEntity>(entity =>
            {
                entity.Property(eventDto => eventDto.PoliceEvent)
                    .HasColumnType("json");
            });
        }
    }
}