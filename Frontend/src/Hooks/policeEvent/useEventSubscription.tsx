import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { EventResponse } from "@/Models/policeEvent.ts";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const hubUrl = "https://blaljuskartan-api.azurewebsites.net/eventHub";



const UseEventSubscription = (datespan: string | undefined) => {
  const queryClient = useQueryClient();
  const [connectionRef, setConnection] = useState<HubConnection>()

  function createHubConnection() {
    const con = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
    setConnection(con);
  }

  useEffect(() => {
    createHubConnection();
  }, []);

  useEffect(() => {
    if (connectionRef) {
      try {
        connectionRef
          .start()
          .then(() => {
            connectionRef.on("ReceiveEvents", (newEvents) => {
              if (newEvents.length !== 0) {
                queryClient.setQueryData(["getPoliceEvents", datespan], (oldData: EventResponse | undefined) => {
                  if (oldData) {
                    const updatedData: EventResponse = {
                      ...oldData,
                      data: [...newEvents,...oldData.data]
                    };
                    return updatedData;
                  } else {
                    return { data: newEvents, message: "", status: true }
                  }
                })
              }

            });
          })
      } catch (error) {
        console.log(error)
      }
    }
    return () => {
      if (connectionRef) {
        connectionRef.stop().then();
      }
    };
  }, [connectionRef, datespan, queryClient]);

};



export default UseEventSubscription;