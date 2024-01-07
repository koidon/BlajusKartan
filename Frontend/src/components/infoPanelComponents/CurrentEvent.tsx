import {Card, CardHeader} from "@/components/ui/card.tsx";
import {Minus} from "lucide-react";
import {Drawer} from "vaul";
import {useMediaQuery} from "usehooks-ts";
import {useState} from "react";
import {EventEntity} from "@/Models/policeEvent.ts";
import {Separator} from "@/components/ui/separator.tsx";

type Props = {
    event: EventEntity | undefined;
};

const CurrentEvent = ({event}: Props) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [hide, setHide] = useState(false);

    return (
        <>
            {isMobile ? (
                <Drawer.Root onClose={() => setHide(false)}>
                    <Drawer.Trigger asChild onClick={() => setHide(true)}>
                            {!hide && (
                                <Card>
                                    <CardHeader
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Minus/>
                                        Nuvarande Event
                                    </CardHeader>
                                </Card>
                            )}
                    </Drawer.Trigger>
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40"/>
                        <Drawer.Content
                            className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
                            <div className="p-4 bg-white rounded-t-[10px] flex-1">
                                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8"/>
                                <div className="max-w-md mx-auto">
                                    <Drawer.Title className="font-medium mb-4">
                                        Nuvarande Event
                                    </Drawer.Title>
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold">
                                            {event?.policeEvent?.name.split(",")[1]?.trim() +
                                                " i " +
                                                event?.policeEvent?.location?.name}
                                        </h3>
                                        <Separator className="my-3"/>
                                        <div className="mb-3">
                                            <p className="text-gray-800">
                                                Inträffat: {event?.EventDate}
                                            </p>
                                            <p className="text-gray-800">
                                                Publicerades:{" "}
                                                {event?.policeEvent?.name.split(",")[0]?.trim()}
                                            </p>
                                        </div>
                                        <Separator className="my-3"/>
                                        <a
                                            href={`https://polisen.se/${event?.policeEvent?.url}`}
                                            className="text-blue-500 hover:underline block mb-3"
                                        >
                                            Se händelse på polisens hemsida
                                        </a>
                                        <Separator className="my-3"/>
                                        <p className="text-gray-700">
                                            {event?.policeEvent?.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>
            ) : (
                <div className="fixed h-full mt-2 border border-blue-500 p-4 rounded shadow-md">
                    <h3 className="mb-4 text-lg font-semibold">
                        {event?.policeEvent?.name.split(",")[1]?.trim() +
                            " i " +
                            event?.policeEvent?.location?.name}
                    </h3>
                    <Separator className="my-3"/>
                    <div className="mb-3">
                        <p className="text-gray-800">Inträffat: {event?.EventDate}</p>
                        <p className="text-gray-800">
                            Publicerades: {event?.policeEvent?.name.split(",")[0]?.trim()}
                        </p>
                    </div>
                    <Separator className="my-3"/>
                    <a
                        href={`https://polisen.se/${event?.policeEvent?.url}`}
                        className="text-blue-500 hover:underline block mb-3"
                    >
                        Se händelse på polisens hemsida
                    </a>
                    <Separator className="my-3"/>
                    <p className="text-gray-700">{event?.policeEvent?.summary}</p>
                </div>
            )}
        </>
    );
};

export default CurrentEvent;
