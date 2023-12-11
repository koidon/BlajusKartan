using System.Net.Http.Headers;
using System.Text.Json;
using Backend;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

const string myAllowFrontend = "_myAllowFrontend";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowFrontend,
        policy => policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});



//ServiceWorker for fetching new events continously
builder.Services.AddHostedService<Worker>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(myAllowFrontend);

app.MapPost("/postPoliceEvents", async ([FromServices] HttpClient httpClient, DataContext dataContext) =>
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

        var policeEvents = await JsonSerializer.DeserializeAsync<List<PoliceEvent>>(responseStream,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

        if (policeEvents is not null)
        {
            foreach (var policeEvent in policeEvents)
            {
                // Check if the event already exists in the database
                var existingEvent = dataContext.PoliceEvents.FirstOrDefault(e => e.PoliceEvent.Id == policeEvent.Id);

                if (existingEvent is null)
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

        serviceResponse.Status = true;
        serviceResponse.Message = "Ok";
        serviceResponse.Data = string.Empty;

        return Results.Ok(serviceResponse);
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

app.MapGet("/getPoliceEventsByType/{type?}", async (string? type, DataContext context) =>
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