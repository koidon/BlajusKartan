import { FileRoute } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import useGetPoliceEvents from "@/Hooks/policeEvent/useGetPoliceEvents.tsx";
import dayjs from "dayjs";

import EventMap from "@/components/EventMap.tsx";
import { useEffect } from "react";
import useEventSubscription from "@/Hooks/policeEvent/useEventSubscription.tsx";

type eventFilter = {
  id: number
}

export const Route = new FileRoute("/").createRoute({
  validateSearch: (search: Record<string, unknown>): eventFilter => {
    return {
      id: Number(search?.id)
    }
  },
  component: IndexComponent
});

function IndexComponent() {
  const datespan = dayjs().format("YYYY-MM-DD");
  //const datespan = "2023-12-17";
  const { data: eventResponse, isLoading } = useGetPoliceEvents(datespan);
  useEventSubscription(datespan);

  useEffect(() => {
    if (eventResponse) {
      eventResponse.data.sort((a, b) => {

        return b.policeEvent.name.localeCompare(a.policeEvent.name);
      });
    }
  }, [eventResponse]);

  if (isLoading) {
    return "Laddar...";
  }

  return (
     <EventMap eventResponse={eventResponse} datespan={datespan}/>
  );
}

export default IndexComponent;
