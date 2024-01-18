import "./App.css";
import {Router, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "@/routeTree.gen.ts";
import {QueryClient} from "@tanstack/react-query";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24,
            staleTime: 1000 * 60 * 60 * 24,
        },
    },
});

const router = new Router({
    routeTree,
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}


const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

function App() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{persister}}
        >
            <RouterProvider router={router}
                            defaultPreload="intent"/>

        </PersistQueryClientProvider>
    );
}

export default App;
