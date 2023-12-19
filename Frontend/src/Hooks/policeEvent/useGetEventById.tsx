import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPoliceEventById } from "@/api/policeEvents/policeEvent-api.ts";
import { EventResponse } from "@/Models/policeEvent.ts";
import { Route as IndexRoute } from "../../routes/index.tsx"
import { useSearch } from "@tanstack/react-router";


const UseGetEventById = (datespan: string) => {
  const {id} = useSearch({
    from: IndexRoute.id,
  })
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["getPoliceEvent", id],
    queryFn: () => getPoliceEventById(id),
    initialData: () => {
      const eventsData = queryClient.getQueryData<EventResponse>([`getPoliceEvents/${datespan}`])?.data;

      if (eventsData && eventsData.length > 0) {
        const specificEvent = eventsData.find((d) => d.id === id);

        return specificEvent || eventsData.reduce((prev, current) =>
          prev.id > current.id ? prev : current
        );
      }

      return null;
    }
  });
};

export default UseGetEventById;