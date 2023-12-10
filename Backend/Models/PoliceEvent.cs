namespace Backend.Models;

public class PoliceEvent
{
    public int Id { get; set; }
    public required string Datetime { get; set; }
    public required string Name { get; set; }
    public required string Summary { get; set; }
    public required string Url { get; set; }
    public required string Type { get; set;  }
    public required Location Location { get; set; }
}

public class Location
{
    public required string Name { get; set; }
    public required string Gps { get; set; }
}