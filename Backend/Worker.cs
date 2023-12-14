using System.Net.Http.Headers;
using System.Text.Json;
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend;
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMapper _mapper;
    private readonly IHubContext<EventHub> _hubContext;

    //Injecta dependencies
    public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory, IMapper mapper, IHubContext<EventHub> hubContext)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
        _mapper = mapper;
        _hubContext = hubContext;
    }

    // Bakgrundtjänst
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

                // Fetch and process events from the API
                await FetchEventsAsync();

                // Delay for a specific interval (e.g., 1 hour)
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in the worker.");
            }
        }
    }

    //API Metod
    private async Task FetchEventsAsync()
    {
        try
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

                var policeApiUrl = "https://polisen.se/api/events";

                var httpClient = _httpClientFactory.CreateClient();

                //user-agent
                var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan-api.azurewebsites.net)");
                httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

                var response = await httpClient.GetAsync(policeApiUrl);
                response.EnsureSuccessStatusCode();

                await using var responseStream = await response.Content.ReadAsStreamAsync();

                var policeEvents = await JsonSerializer.DeserializeAsync<List<PoliceEvent>>(
                    responseStream,
                    new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                if (policeEvents is not null && policeEvents.Any())
                {

                    var newEvents = new List<PoliceEventEntity>();

                    foreach (var policeEvent in policeEvents)
                    {
                        // Kontroll av ny händelse
                        var existingEvent =
                            dataContext.PoliceEvents.FirstOrDefault(e => e.PoliceEvent.Id == policeEvent.Id);

                        if (existingEvent is null)
                        {
                            if (DateTimeOffset.TryParse(policeEvent.Datetime, out DateTimeOffset dateTimeOffset))
                            {
                                PoliceEventEntity policeEventEntity = new PoliceEventEntity
                                {
                                    PoliceEvent = _mapper.Map<PoliceEventDto>(policeEvent),
                                    EventDate = dateTimeOffset
                                };

                                newEvents.Add(policeEventEntity);

                            }
                            else
                            {
                                PoliceEventEntity policeEventEntity = new PoliceEventEntity
                                {
                                    PoliceEvent = _mapper.Map<PoliceEventDto>(policeEvent),
                                    EventDate = null
                                };
                                newEvents.Add(policeEventEntity);
                            }
                        }
                    }
                    dataContext.PoliceEvents.AddRange(newEvents);
                    await dataContext.SaveChangesAsync();

                    await _hubContext.Clients.All.SendAsync("ReceiveEvents", newEvents);

                }

                _logger.LogInformation("Fetching and processing events completed.");
            }
        }
        catch (HttpRequestException httpEx)
        {
            _logger.LogError(httpEx, "HTTP request error when fetching events.");
        }
        catch (JsonException jsonEx)
        {
            _logger.LogError(jsonEx, "JSON deserialization error when fetching events.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred when fetching events.");
        }
    }
}