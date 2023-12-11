using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Data;
using Backend.Models;

namespace Backend;
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;

    //Injecta dependencies
    public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
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
                var commentValue = new ProductInfoHeaderValue("(+https://blaljuskartan.se)", "1.0");
                httpClient.DefaultRequestHeaders.UserAgent.Add(commentValue);

                var response = await httpClient.GetAsync(policeApiUrl);
                response.EnsureSuccessStatusCode();

                await using var responseStream = await response.Content.ReadAsStreamAsync();

                var policeEvents = await System.Text.Json.JsonSerializer.DeserializeAsync<List<PoliceEvent>>(
                    responseStream,
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

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Consume Scoped Service Hosted Service is stopping.");

        await base.StopAsync(stoppingToken);
    }
}