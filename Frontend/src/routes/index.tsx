import {FileRoute, SearchSchemaInput} from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";

import EventMap from "@/components/EventMap.tsx";
import useEventSubscription from "@/Hooks/policeEvent/useEventSubscription.tsx";
import {useSuspenseQuery} from "@tanstack/react-query";
import useEventsOptions from "@/Hooks/policeEvent/useEventsOptions.tsx";
import {z} from "zod";
import dayjs from "dayjs";

export const Route = new FileRoute("/").createRoute({
    validateSearch: (
        input: {
            id: number,
            date: Date,
        } & SearchSchemaInput,
    ) =>
        z
            .object({
                id: z.number().optional(),
                date: z.string().default(dayjs().format("YYYY-MM-DD")),
            })
            .parse(input),
    loader: ({context}) =>
       context.queryClient.ensureQueryData(useEventsOptions(dayjs().format("YYYY-MM-DD"))),
    component: IndexComponent
});

function IndexComponent() {
    //const datespan = "2023-12-13";
    const {date} = Route.useSearch();
    const {data: eventResponse} = useSuspenseQuery(useEventsOptions(date));
    useEventSubscription(date);

    return (
        <EventMap eventResponse={eventResponse}/>
    );
}

export default IndexComponent;
