import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { EventResponse } from "@/Models/policeEvent.ts";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

const hubUrl = "https://blaljuskartan-api.azurewebsites.net/eventHub";

const UseEventSubscription = (date: string) => {
  const queryClient = useQueryClient();
  const [connectionRef, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const createHubConnection = () => {
      const con = new HubConnectionBuilder()
          .withUrl(hubUrl)
          .withAutomaticReconnect()
          .build();
      setConnection(con);
    };

    if (!connectionRef) {
      createHubConnection();
    }

    // Cleanup function
    return () => {
      if (connectionRef && connectionRef.state === HubConnectionState.Connected) {
        connectionRef.stop();
      }
    };
  }, [connectionRef]);

  useEffect(() => {
    if (connectionRef) {
      const startConnection = async () => {
        try {
          if (connectionRef.state === HubConnectionState.Disconnected) {
            await connectionRef.start();
          }
        } catch (error) {
          console.error("Error starting SignalR connection:", error);
        }
      };

      const handleReceiveEvents = (newEvents: any) => {
        if (newEvents.length !== 0) {
          queryClient.setQueryData(["getPoliceEvents", date], (oldData: EventResponse | undefined) => {
            if (oldData) {
              const updatedData: EventResponse = {
                ...oldData,
                data: [...newEvents, ...oldData.data],
              };
              return updatedData;
            } else {
              return { data: newEvents, message: "", status: true };
            }
          });
        }
      };

      connectionRef.on("ReceiveEvents", handleReceiveEvents);

      startConnection();

      // Cleanup function
      return () => {
        connectionRef.off("ReceiveEvents", handleReceiveEvents);
      };
    }
  }, [connectionRef, date, queryClient]);

};

export default UseEventSubscription;
