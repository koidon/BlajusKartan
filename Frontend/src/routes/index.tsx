import {FileRoute} from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import dayjs from "dayjs";

import EventMap from "@/components/EventMap.tsx";
import useEventSubscription from "@/Hooks/policeEvent/useEventSubscription.tsx";
import {useSuspenseQuery} from "@tanstack/react-query";
import useEventsOptions from "@/Hooks/policeEvent/useEventsOptions.tsx";

type eventFilter = {
    id: number;
}

export const Route = new FileRoute("/").createRoute({
    validateSearch: (search: Record<string, unknown>): eventFilter => {
        return {
            id: Number(search?.id)
        }
    },
    loader: ({context: {queryClient}}) =>
       queryClient.ensureQueryData(useEventsOptions()),
    component: IndexComponent
});

function IndexComponent() {
    const datespan = dayjs().format("YYYY-MM-DD");
    //const datespan = "2023-12-13";
    const {data: eventResponse} = useSuspenseQuery(useEventsOptions());
    useEventSubscription(datespan);

    return (
        <EventMap eventResponse={eventResponse} datespan={datespan}/>
    );
}

export default IndexComponent;
