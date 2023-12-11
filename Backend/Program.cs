using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
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

app.MapPost("/postAllPoliceEvents", async ([FromServices] HttpClient httpClient, DataContext dataContext) =>
{
    var serviceResponse = new ServiceResponse<string>();


    var policeApiUrl = "https://polisen.se/api/events";

    var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan.se)");

    httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

    try
    {
        var response = await httpClient.GetAsync(policeApiUrl);

        response.EnsureSuccessStatusCode();

        await using var responseStream = await response.Content.ReadAsStreamAsync();

        var policeEvents = await JsonSerializer.DeserializeAsync<ServiceResponse<List<PoliceEvent>>>(responseStream,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });


        if (policeEvents?.Data != null)
            foreach (var policeEvent in policeEvents.Data)
            {
                PoliceEventEntity policeEventEntity = new PoliceEventEntity
                {
                    PoliceEvent = policeEvent
                };

                dataContext.PoliceEvents.Add(policeEventEntity);
                await dataContext.SaveChangesAsync();
            }

        return Results.Ok(policeEvents);
    }
    catch (Exception ex)
    {
        serviceResponse.Status = false;
        serviceResponse.Message = $"Error: {ex.Message}";
        return Results.BadRequest("Oväntat fel från API");
    }
});

app.MapPost("/postNewPoliceEvents", async ([FromServices] HttpClient httpClient, DataContext dataContext) =>
{
    var serviceResponse = new ServiceResponse<string>();

    var policeApiUrl = "https://polisen.se/api/events";

    var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan.se)");

    httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

    try
    {
        var response = await httpClient.GetAsync(policeApiUrl);

        response.EnsureSuccessStatusCode();

        await using var responseStream = await response.Content.ReadAsStreamAsync();

        var policeEvents = await JsonSerializer.DeserializeAsync<ServiceResponse<List<PoliceEvent>>>(responseStream,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

        if (policeEvents?.Data != null)
        {
            foreach (var policeEvent in policeEvents.Data)
            {
                // Check if the event already exists in the database
                var existingEvent = dataContext.PoliceEvents.FirstOrDefault(e => e.PoliceEvent.Id == policeEvent.Id);

                if (existingEvent == null)
                {
                    // Nytt event
                    PoliceEventEntity policeEventEntity = new PoliceEventEntity
                    {
                        PoliceEvent = policeEvent
                    };

                    dataContext.PoliceEvents.Add(policeEventEntity);
                    await dataContext.SaveChangesAsync();
                }
            }
        }

        return Results.Ok(policeEvents);
    }
    catch (Exception ex)
    {
        serviceResponse.Status = false;
        serviceResponse.Message = $"Error: {ex.Message}";
        return Results.BadRequest("Oväntat fel från API");
    }
});

app.MapGet("/getPoliceEvents/{datespan}", async (string datespan, DataContext context) =>
{
    var serviceResponse = new ServiceResponse<List<PoliceEventEntity>>();

    var policeEvents = await context.PoliceEvents
        .Where(e => e.PoliceEvent.Datetime.Contains(datespan))
        .ToListAsync();

    if (policeEvents.Count == 0)
    {
        serviceResponse.Message = "NotFound";
        serviceResponse.Status = false;
        serviceResponse.Data = null;
        return Results.NotFound(serviceResponse);
    }

    serviceResponse.Message = "Ok";
    serviceResponse.Data = policeEvents;

    return Results.Ok(serviceResponse);
});

app.MapGet("/getPoliceEventsByType/{type?}", async (string type, DataContext context) =>
{
    var serviceResponse = new ServiceResponse<List<PoliceEventEntity>>();

    IQueryable<PoliceEventEntity> query = context.PoliceEvents;

    // Om type (kategori) specificeras
    if (!string.IsNullOrEmpty(type))
    {
        query = query.Where(e => e.PoliceEvent.Type == type);
    }

    var policeEvents = await query.ToListAsync();

    if (policeEvents.Count == 0)
    {
        serviceResponse.Message = "NotFound";
        serviceResponse.Status = false;
        serviceResponse.Data = null;
        return Results.NotFound(serviceResponse);
    }

    serviceResponse.Message = "Ok";
    serviceResponse.Data = policeEvents;

    return Results.Ok(serviceResponse);
});

app.MapGet("/getPoliceEventById/{id}", async (int id, DataContext context) =>
{
    var serviceResponse = new ServiceResponse<PoliceEventEntity>();

    var policeEvent = await context.PoliceEvents
        .FirstOrDefaultAsync(e => e.PoliceEvent.Id == id);

    if (policeEvent == null)
    {
        serviceResponse.Message = "NotFound";
        serviceResponse.Status = false;
        serviceResponse.Data = null;
        return Results.NotFound(serviceResponse);
    }

    serviceResponse.Message = "Ok";
    serviceResponse.Data = policeEvent;

    return Results.Ok(serviceResponse);
});


app.Run();