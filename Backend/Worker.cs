using System.Net.Http.Headers;
using Backend.Data;
using Backend.Models;

namespace Backend;
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _httpClient;

    //Injecta dependencies
    public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, HttpClient httpClient)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _httpClient = httpClient;
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
        using (var scope = _serviceProvider.CreateScope())
        {
            var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

            var serviceResponse = new ServiceResponse<string>();

            var policeApiUrl = "https://polisen.se/api/events";

            //user-agent
            var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan.se)");
            _httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

            var response = await _httpClient.GetAsync(policeApiUrl);
            response.EnsureSuccessStatusCode();

            await using var responseStream = await response.Content.ReadAsStreamAsync();

            var policeEvents = await System.Text.Json.JsonSerializer.DeserializeAsync<List<PoliceEvent>>(responseStream,
                new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
                });

            if (policeEvents is not null)
            {
                foreach (var policeEvent in policeEvents)
                {
                    // Kontroll av ny händelse
                    var existingEvent =
                        dataContext.PoliceEvents.FirstOrDefault(e => e.PoliceEvent.Id == policeEvent.Id);

                    if (existingEvent is null)
                    {
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

            _logger.LogInformation("Fetching and processing events completed.");
        }
    }
}