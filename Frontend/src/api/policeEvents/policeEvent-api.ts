import axios from "@/api/axiosInstance.ts";
import { EventResponse } from "@/Models/policeEvent.ts";
export const getPoliceEvents = async (datespan: string) => {
  const response = await axios.get<EventResponse>(
    `getPoliceEvents/${datespan}`,
  );
  return response.data;
};
