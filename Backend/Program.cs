using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapPost("/createBook", (Book book, DataContext context) =>
{
    context.Books.Add(book);
    context.SaveChanges();
    return book;
});

app.MapGet("/getBook{id}", (int id, DataContext context) =>
{
    var book = context.Books.FirstOrDefault(book => book.Id == id);

    return book is null ? Results.NotFound() : Results.Ok(book);
});

app.Run();