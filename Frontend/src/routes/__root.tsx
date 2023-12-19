import { Outlet, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navigation from "@/components/Navigation.tsx";
import { useMediaQuery } from "usehooks-ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = new RootRoute({

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
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools initialIsOpen={false} />
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
