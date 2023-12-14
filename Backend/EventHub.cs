using Backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend;

public class EventHub : Hub
{
    public async Task BroadcastEvents(List<PoliceEventEntity> events)
    {

        await Clients.All.SendAsync("ReceiveEvents", events);
    }
}