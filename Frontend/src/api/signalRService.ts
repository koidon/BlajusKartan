import * as signalR from "@microsoft/signalr";
import { EventEntity } from "@/Models/policeEvent.ts";

type ReceiveEventsCallback = (events: EventEntity[]) => void;

const hubUrl = "wss://localhost:5118/eventhub";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl)
  .configureLogging(signalR.LogLevel.Information)
  .build();

const startConnection = async () => {
  try {
    await connection.start();
    console.log("SignalR Connected!");
  } catch (err) {
    console.error("Error connecting to SignalR:", err);
  }
};

const onReceiveEvents = (callback: ReceiveEventsCallback) => {
  connection.on("ReceiveEvents", (events) => {
    callback(events);
  });
};

export { startConnection, onReceiveEvents };
