import { useMediaQuery } from "usehooks-ts";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Minus } from "lucide-react";
import { Drawer } from "vaul";
import { useState } from "react";
import { EventResponse } from "@/Models/policeEvent.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { Route as IndexRoute} from "@/routes/index.tsx"

type Props = {
  events: EventResponse | undefined;
};

const Latest = ({ events }: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hide, setHide] = useState(false);
  const navigate = useNavigate({ from: IndexRoute.id})

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
                  <ScrollArea className="h-72 rounded-md border">
                    {events?.data.map((eventEntity) => {
                      return (
                        <div className="hover:shadow-md" onClick={() => {
                          navigate({
                            search: () => ({ id: eventEntity.id})
                          }).then()
                        }}>{eventEntity.policeEvent.name}</div>
                      );
                    })}
                  </ScrollArea>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ) : (
        <div className="mt-auto">
        <h3 className="mb-4 text-md font-medium leading-none">Senaste nytt</h3>
        <ScrollArea className="h-72 rounded-md border">
          {events?.data.map((eventEntity) =>
            <div key={eventEntity.id} className="hover:shadow-md">
            <div  onClick={() => {
              navigate({
                search: () => ({ id: eventEntity.id})
              }).then()
            }}>{eventEntity.policeEvent.name}</div>
              <Separator className="my-2" />
            </div>
          )}
        </ScrollArea>
          <Link from={IndexRoute.id} search={{
            id: 3
          }}>Test</Link>
        </div>
      )}
    </>
  );
};

export default Latest;
