using System.Globalization;
using Backend;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

const string myAllowFrontend = "_myAllowFrontend";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
var serverVersion = new MySqlServerVersion(new Version(10, 6, 12));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(optionsBuilder =>
    optionsBuilder.UseMySql(connectionString, serverVersion, options => options.UseMicrosoftJson()));
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowFrontend,
        policy => policy.WithOrigins("http://localhost:5173", "https://brave-plant-021e67f03.4.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});
builder.Services.AddSignalR();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddHostedService<Worker>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(myAllowFrontend);
app.UseHttpsRedirection();
app.MapHub<EventHub>("/eventHub");


app.MapGet("/getPoliceEvents/{date}", async (string date, DataContext context) =>
{
    var serviceResponse = new ServiceResponse<List<PoliceEventEntity>>();

    try
    {
        if (DateTimeOffset.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out DateTimeOffset dateTimeOffset))
        {
            var startDate = dateTimeOffset.Date;
            var endDate = startDate.AddDays(1);

            var policeEvents = await context.PoliceEvents
                .Where(e => e.EventDate >= startDate && e.EventDate < endDate)
                .ToListAsync();

            serviceResponse.Message = "Ok";
            serviceResponse.Data = policeEvents;

            return Results.Ok(serviceResponse);
        }

        serviceResponse.Message = "Invalid date format";
        serviceResponse.Status = false;
        serviceResponse.Data = null;
        return Results.BadRequest(serviceResponse);
    }
    catch (Exception ex)
    {
        serviceResponse.Message = "Error: " + ex;
        serviceResponse.Status = false;
        serviceResponse.Data = null;
        return Results.BadRequest(serviceResponse);
    }
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