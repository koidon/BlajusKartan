import {queryOptions} from "@tanstack/react-query";
import { getPoliceEvents } from "@/api/policeEvents/policeEvent-api.ts";
import dayjs from "dayjs";

const UseEventsOptions = () => {
  const datespan = dayjs().format("YYYY-MM-DD");
  return queryOptions({
    queryKey: ["getPoliceEvents", datespan],
    queryFn: () => getPoliceEvents(datespan),
  });
};

export default UseEventsOptions;
