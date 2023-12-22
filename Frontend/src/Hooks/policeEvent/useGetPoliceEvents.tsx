import { useQuery } from "@tanstack/react-query";
import { getPoliceEvents } from "@/api/policeEvents/policeEvent-api.ts";

const UseGetPoliceEvents = (datespan: string) => {
  return useQuery({
    queryKey: ["getPoliceEvents", datespan],
    queryFn: () => getPoliceEvents(datespan),
  });
};

export default UseGetPoliceEvents;
