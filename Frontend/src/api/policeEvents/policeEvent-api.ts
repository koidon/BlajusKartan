import axios from "@/api/axiosInstance.ts";
import { EventIdResponse, EventResponse } from "@/Models/policeEvent.ts";
export const getPoliceEvents = async (datespan: string | undefined) => {
  await new Promise((r) => setTimeout(r, 500))
  const response = await axios.get<EventResponse>(
    `getPoliceEvents/${datespan}`,
  );
  return response.data;
};

export const getPoliceEventById = async (id: number) => {
  const response = await axios.get<EventIdResponse>(
    `getPoliceEventById/${id}`,
  );
  return response.data.data;
}
