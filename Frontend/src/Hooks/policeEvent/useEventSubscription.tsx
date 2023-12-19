import { useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { EventResponse } from "@/Models/policeEvent.ts";

const hubUrl = "https://blaljuskartan-api.azurewebsites.net/eventHub";



const UseEventSubscription = (datespan: string) => {
  const queryClient = useQueryClient();
  const loadedRef = useRef(false);
  React.useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const start = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected.")
        connection.on("ReceiveEvents", (newEvents) => {
         if (newEvents.length !== 0) {
           queryClient.setQueryData([`getPoliceEvents/${datespan}`], (oldData: EventResponse | undefined) => {
             if (oldData) {
               const updatedData: EventResponse = {
                 ...oldData,
                 data: [...oldData.data, ...newEvents]
               };
               return updatedData;
             } else {
               return { data: newEvents, message: "", status: true}
             }
           })
         }

        });
      } catch (err) {
        console.log(err)
        setTimeout(start, 5000);
      }

      connection.onclose(async () => {
        await start();
      });
    }

    start().catch(console.error);

    return () => {
      connection.stop().catch(console.error)
    }
  }, [queryClient, datespan])
};

export default UseEventSubscription;