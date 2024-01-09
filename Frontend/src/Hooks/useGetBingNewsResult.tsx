import {useQuery} from "@tanstack/react-query";
import {getBingNewsResults} from "@/api/bingSearch-api.ts";


const UseGetBingNewsResult = (q: string | undefined) => {
    return useQuery({
        queryKey: ["getBingNewsResult", q],
        refetchOnWindowFocus: false,
        queryFn: () => getBingNewsResults(q)
    });
};

export default UseGetBingNewsResult;