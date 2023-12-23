import {Outlet, rootRouteWithContext} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navigation from "@/components/Navigation.tsx";
import { useMediaQuery } from "usehooks-ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {QueryClient} from "@tanstack/react-query";

export const Route = rootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
});

function RootComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {!isMobile ? (
        <>
          <div className="h-full flex flex-none dark:bg-[#1F1F1F] overflow-auto w-full">
            <Navigation />
            <main>
              <Outlet />
            </main>
          </div>
          <div className="absolute z-[999999999]">
            <TanStackRouterDevtools position="bottom-right"/>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left"/>
          </div>
        </>
      ) : (
        <>
          <div className="flex-col h-full relative">
            <main className="flex-1 relative z-0">
              <Outlet />
            </main>
          </div>
        </>
      )}
    </>
  );
}
