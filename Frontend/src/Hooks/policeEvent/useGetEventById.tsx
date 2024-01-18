import {useQuery, useQueryClient} from "@tanstack/react-query";
import {EventResponse} from "@/Models/policeEvent.ts";


const UseGetEventById = (date: string, id: number | undefined ) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["getPoliceEvent", id],
        enabled: !!id,
        queryFn: () => queryClient.getQueryData<EventResponse>(["getPoliceEvents", date])?.data?.find((d) => d.id === id),
    });
};

export default UseGetEventById;