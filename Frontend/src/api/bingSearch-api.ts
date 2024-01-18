import axios from "@/api/axiosInstance.ts";
type Webpage = {
    about: unknown; // Update the type of 'about' to match the actual data structure
    dateLastCrawled: string;
    contractualRules: unknown; // Update the type of 'contractualRules' to match the actual data structure
    deepLinks: Webpage[];
    displayUrl: string;
    id?: string;
    isFamilyFriendly: boolean;
    isNavigational: boolean;
    language: string;
    malware: unknown;
    name: string;
    mentions: object; // Update the type of 'mentions' to match the actual data structure
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

const apiKey = import.meta.env.VITE_BINGNEWS_KEY;

export const getBingNewsResults = async (q: string | undefined) => {
    const params = {
        responseFilter: 'webpages',
        q: q,
        count: '5'
    };
    const response = await axios.get<SearchResponse>(
        'https://api.bing.microsoft.com/v7.0/search', {
            params, headers: {
                'Ocp-Apim-Subscription-Key': apiKey
            }
        },
    );
    return response.data;
};