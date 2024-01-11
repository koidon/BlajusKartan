import {useMediaQuery} from "usehooks-ts";
import React, {ElementRef, useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import {EventEntity, EventResponse} from "@/Models/policeEvent.ts";
import {Separator} from "@/components/ui/separator.tsx";
import useGetBingNewsResult from "@/Hooks/useGetBingNewsResult.tsx";
import DatePicker from "@/components/infoPanelComponents/DatePicker.tsx";

type Props = {
    events: EventResponse;
    event: EventEntity | undefined
};

const InfoPanel = ({events, event}: Props) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const {data: newsResult} = useGetBingNewsResult(event?.policeEvent.name)
    //const {currentEvent} = useCurrentEvent();

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 320) newWidth = 320;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth + 80}px`);
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "320px";
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "400px");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("left", "80px");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-hidden relative flex w-60 flex-col z-[9999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0",
                )}
            >
                <DatePicker/>
                <div className="mt-2 border border-blue-500 p-4 rounded shadow-md">
                    <h3 className="mb-4 text-lg font-semibold">{event?.policeEvent?.name.split(",")[1].trim() + " i " + event?.policeEvent?.location.name}</h3>
                    <Separator className="my-3"/>
                    <div className="mb-3">
                        <p className="text-gray-800">Inträffat: {event?.eventDate}</p>
                        <p className="text-gray-800">Publicerades: {event?.policeEvent.name.split(",")[0].trim()}</p>
                    </div>
                    <Separator className="my-3"/>
                    <a href={`https://polisen.se/${event?.policeEvent.url}`}
                       className="text-blue-500 hover:underline block mb-3">
                        Se händelse på polisens hemsida
                    </a>
                    <Separator className="my-3"/>
                    <p className="text-gray-700">{event?.policeEvent.summary}</p>
                    <br/>
                    <h2>Relaterade länkar</h2>
                    {newsResult?.webPages?.value?.slice(0,5).map((webPage) => (
                        <a href={webPage.url} key={webPage.id} className="text-blue-500 hover:underline block mb-3">{webPage.name}</a>

                    ))}
                </div>

                <br/>
                <Latest events={events}/>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "fixed z-[50] top-1/2 transform -translate-y-1/2 w-6 overflow-hidden",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full",
                )}
            >
                <nav className="h-12 w-6 text-muted-foreground group-hover/sidebar:opacity-100 transition">
                    {isCollapsed ? (
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                    <ChevronRight
                                        onClick={resetWidth}
                                        role="button"
                                        className={cn(
                                            "h-12 w-6 text-muted-foreground bg-[#181A1B]  rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600",
                                            isMobile && "visibility: hidden",
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#181A1B]" side="right">
                                    <p className="text-white">Öppna sidopanelen</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div
                            onClick={collapse}
                            role="button"
                            className={cn(
                                "h-12 w-6 text-muted-foreground bg-[#181A1B] rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600  group-hover/sidebar:opacity-100 transition",
                                isMobile && "opacity-100",
                            )}
                        >
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <ChevronLeft className="h-12 w-6"/>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#181A1B]" side="right">
                                        <p className="text-white">Stäng sidopanelen</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
};

export default InfoPanel;
