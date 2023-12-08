namespace Backend.Models;

public class PoliceEventEntity
{
    public int Id { get; set; }
    public DateTime FetchedAt { get; set; } = DateTime.Now;
    public required PoliceEvent PoliceEvent { get; set; }
}