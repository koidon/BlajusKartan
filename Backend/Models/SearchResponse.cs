namespace Backend.Models;

public class SearchResponse
{
    public object? QueryContext { get; set; }
    public object? RankingResponse { get; set; }
    public WebAnswer? WebPages { get; set; }
}

public class WebAnswer
{
    public string? Id { get; set; }
    public bool? SomeResultsRemoved { get; set; }
    public int? TotalEstimateMatches { get; set; }
    public List<Webpage>? Value { get; set; }
}

public class Webpage
{
    public object? About { get; set; }
    public string? DateLastCrawled { get; set; }
    public object? ContractualRules { get; set; }
    public List<Webpage>? DeepLinks { get; set; }
    public string? DisplayUrl { get; set; }
    public string? Id { get; set; }
    public bool IsFamilyFriendly { get; set; }
    public bool IsNavigational { get; set; }
    public string? Language { get; set; }
    public object? Malware { get; set; }
    public string? Name { get; set; }
    public object? Mentions { get; set; }
    public object? SearchTags { get; set; }
    public string? Snippet { get; set; }
    public string? Url { get; set; }
}
