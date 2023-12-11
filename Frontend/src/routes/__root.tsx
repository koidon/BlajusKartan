import { Outlet, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navigation from "@/components/Navigation.tsx";
import { useMediaQuery } from "usehooks-ts";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

export const Route = new RootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMapClicked, setIsMapClicked] = useState(false);

  const handleMapClick = () => {
    setIsMapClicked((prev) => !prev);
  };

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
          </div>
        </>
      ) : (
        <>
          <div className="flex-col h-full relative">
            <main className="flex-1 relative z-0" onClick={handleMapClick}>
              <Outlet />
            </main>
            <div
              className={cn(
                "fixed bottom-0 left-0 right-0 z-10 mb-[4.25rem] transition-all duration-300 ease-in-out",
                isMapClicked && "transform translate-y-full opacity-0",
              )}
            >
              <Latest />
            </div>
            <div
              className={cn(
                "fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out",
                isMapClicked && "transform translate-y-full opacity-0",
              )}
            >
              <Navigation />
            </div>
          </div>
        </>
      )}
    </>
  );
}
