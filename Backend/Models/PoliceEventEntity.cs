using System.ComponentModel.DataAnnotations.Schema;
using Backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Index(nameof(EventDate))]
public class PoliceEventEntity
{
    public int Id { get; set; }

    public DateTimeOffset? EventDate { get; set; }

    public required PoliceEventDto PoliceEvent { get; set; }
}