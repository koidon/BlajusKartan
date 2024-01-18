import axios from "@/api/axiosInstance.ts";
type Webpage = {
    about: unknown;
    dateLastCrawled: string;
    contractualRules: unknown;
    deepLinks: Webpage[];
    displayUrl: string;
    id?: string;
    isFamilyFriendly: boolean;
    isNavigational: boolean;
    language: string;
    malware: unknown;
    name: string;
    mentions: object;
    searchTags: unknown;
    snippet: string;
    url: string;
};

type WebAnswer = {
    id: string;
    someResultsRemvoed: boolean;
    totalEstimateMatches: Number;
    value: Array<Webpage>
}

type SearchResponse = {
    queryContext: unknown;
    rankingResponse: unknown;
    webPages: WebAnswer
}

export const getBingNewsResults = async (query: string | undefined) => {
    const response = await axios.get<SearchResponse>(
        `/getBingNewsResults/${query}`,
    );
    return response.data;
};