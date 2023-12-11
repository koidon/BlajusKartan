using Backend;
using Backend.Data;
using Backend.Models;
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
        policy => policy.WithOrigins("http://localhost:5173", "https://brave-plant-021e67f03.4.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

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