using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();

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
    return Results.Ok(book);
});

app.MapGet("/getBook{id}", (int id, DataContext context) =>
{
    var book = context.Books.FirstOrDefault(book => book.Id == id);

    return book is null ? Results.NotFound() : Results.Ok(book);
});

app.MapPost("/postPoliceEvents", async ([FromServices] HttpClient httpClient, DataContext dataContext) =>
{
    var policeApiUrl = "https://polisen.se/api/events";

    var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan.se)");

    httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

    try
    {
        var response = await httpClient.GetAsync(policeApiUrl);

        response.EnsureSuccessStatusCode();

        await using var responseStream = await response.Content.ReadAsStreamAsync();

        var policeEvents = await JsonSerializer.DeserializeAsync<List<PoliceEvent>>(responseStream,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

        if (policeEvents is null)
        {
            throw new Exception("Oväntat fel från API");
        }

        foreach (var policeEvent in policeEvents)
        {
            PoliceEventEntity policeEventEntity = new PoliceEventEntity
            {
                PoliceEvent = policeEvent
            };

            dataContext.PoliceEvents.Add(policeEventEntity);
            await dataContext.SaveChangesAsync();
        }
    }
    catch (Exception ex)
    {
        return Results.BadRequest("Oväntat fel från API");
    }

    return Results.Ok();
});

app.MapGet("/getPoliceEvents/{datespan}", async (string datespan, DataContext context) =>
{

     // Assuming you want events within a single day

    var policeEvents = await context.PoliceEvents
        .Where(e => e.PoliceEvent.Datetime.Contains(datespan))
        .ToListAsync();

    return policeEvents.Count == 0 ? Results.NotFound() : Results.Ok(policeEvents);
});

app.Run();