import { useMediaQuery } from "usehooks-ts";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Minus } from "lucide-react";
import { Drawer } from "vaul";
import { useState } from "react";
import { GeojsonFeatures } from "@/routes";

type Props = {
  geoJsonFeatures: GeojsonFeatures;
};

const Latest = ({ geoJsonFeatures }: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hide, setHide] = useState(false);
  //const [events, setEvents] = useState<EventEntity[]>([]);

  /*useEffect(() => {
    // Start SignalR connection when the component mounts
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5118/eventHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Listen for real-time events
    connection.start().then(() => {
      connection.on("ReceiveEvents", (events) => {
        // Update state with the new events
        setEvents(events);
      });
    });

    // Clean up SignalR connection when the component unmounts
    return () => {
      connection.stop();
    };
  }, []);*/

  return (
    <>
      {isMobile ? (
        <Drawer.Root onClose={() => setHide(false)}>
          <Drawer.Trigger asChild onClick={() => setHide(true)}>
            {!hide && (
              <Card>
                <CardHeader className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <Minus />
                  Senaste Nytt
                </CardHeader>
              </Card>
            )}
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
              <div className="p-4 bg-white rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                <div className="max-w-md mx-auto">
                  <Drawer.Title className="font-medium mb-4">
                    Senaste events
                  </Drawer.Title>
                  {geoJsonFeatures.features.map((feature) => {
                    return (
                      <div key={feature.id}>{feature.properties.name}</div>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
                <div className="flex gap-6 justify-end max-w-md mx-auto">
                  <a
                    className="text-xs text-zinc-600 flex items-center gap-0.25"
                    href="https://github.com/emilkowalski/vaul"
                    target="_blank"
                  >
                    GitHub
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="16"
                      aria-hidden="true"
                      className="w-3 h-3 ml-1"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14L21 3"></path>
                    </svg>
                  </a>
                  <a
                    className="text-xs text-zinc-600 flex items-center gap-0.25"
                    href="https://twitter.com/emilkowalski_"
                    target="_blank"
                  >
                    Twitter
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="16"
                      aria-hidden="true"
                      className="w-3 h-3 ml-1"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14L21 3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ) : (
        <div className="overflow-scroll h-1/4">
          <h1>Senaste nytt</h1>
          {geoJsonFeatures.features.map((feature) => {
            return <div key={feature.id}>{feature.properties.name}</div>;
          })}
          {/*events.map((events) => {
            return <div key={events.id}>{events.policeEvent.name}</div>;
          })*/}
        </div>
      )}
    </>
  );
};

export default Latest;
