import {queryOptions} from "@tanstack/react-query";
import { getPoliceEvents } from "@/api/policeEvents/policeEvent-api.ts";

const UseEventsOptions = (datespan: string | undefined) => {
  return queryOptions({
    queryKey: ["getPoliceEvents", datespan],
    queryFn: () => getPoliceEvents(datespan),
  });
};

export default UseEventsOptions;
