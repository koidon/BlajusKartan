import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {CalendarIcon, ChevronLeft, ChevronRight} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import dayjs from "dayjs";
import { sv } from 'date-fns/locale';
import {useNavigate, useSearch} from "@tanstack/react-router";
import {Route as IndexRoute} from "@/routes";
import {useState} from "react";

const DatePicker = () => {
    const navigate = useNavigate({ from: IndexRoute.id})
    const {date} = useSearch({
        from: IndexRoute.id
    })


    const [selectedDate, setSelectedDate] = useState(date ? dayjs(date).toDate() : undefined);


    return (
        <div className="flex content-between  mt-1">
            <div className="p-2 m-1 border-2 rounded-sm">
                <ChevronLeft/>
            </div>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[220px] justify-start text-left font-normal self-center",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? dayjs().format('YYYY-MM-DD') : <span>Datum</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[999999]">
                <Calendar
                    locale={sv}
                    mode="single"
                    selected={selectedDate}
                    onSelect={(newDate) => {
                        // Update state with the selected date
                        setSelectedDate(newDate);

                        // Convert newDate to string if needed
                        const formattedDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : null;

                        navigate({
                            search: () => ({ date: formattedDate })
                        }).then();
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
            <div className="p-2 m-1 border-2 rounded-sm">
                <ChevronRight/>
            </div>
        </div>
    )
};

export default DatePicker;