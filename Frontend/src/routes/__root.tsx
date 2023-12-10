import { Outlet, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import InfoPanel from "@/components/InfoPanel.tsx";
import Navigation from "@/components/Navigation.tsx";
import { useMediaQuery } from "usehooks-ts";
import Latest from "@/components/infoPanelComponents/Latest.tsx";

export const Route = new RootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      {!isMobile ? (
        <div className="h-full flex dark:bg-[#1F1F1F] overflow-auto">
          <Navigation />
          <InfoPanel />
          <main className="h-full">
            <Outlet />
          </main>
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      ) : (
        <>
          <div className="h-screen">
            <div className="flex dark:bg-[#1F1F1F] overflow-auto">
              <InfoPanel />
              <main className="h-full">
                <Outlet />
              </main>
              <TanStackRouterDevtools position="bottom-right" />
            </div>
            <Latest />
            <Navigation />
          </div>
        </>
      )}
    </>
  );
}
