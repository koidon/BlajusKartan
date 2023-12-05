using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{


   public DbSet<Book> Books => Set<Book>();

}