using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<PoliceEventEntity> PoliceEvents => Set<PoliceEventEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PoliceEventEntity>().OwnsOne(e => e.PoliceEvent, b =>
        {
            b.OwnsOne(e => e.Location);
            b.ToJson();
        });
    }
}