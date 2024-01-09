import {useQuery, useQueryClient} from "@tanstack/react-query";
import {EventResponse} from "@/Models/policeEvent.ts";


const UseGetEventById = (datespan: string | undefined, id: number ) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["getPoliceEvent", id],
        queryFn: () => queryClient.getQueryData<EventResponse>(["getPoliceEvents", datespan])?.data?.find((d) => d.id === id),
    });
};

export default UseGetEventById;