import { useMediaQuery } from 'usehooks-ts';
import { Separator } from '@/components/ui/separator';
import { EventEntity } from '@/Models/policeEvent.ts';

const CurrentEvent = () => {

    const isMobile = useMediaQuery('(max-width: 768px)');
    const event: EventEntity | undefined = ""


    return (
        <div className="mt-2 border border-blue-500 p-4 rounded shadow-md">
            <h3 className="mb-4 text-lg font-semibold">
                {event?.policeEvent?.name.split(',')[1]?.trim() + ' i ' + event?.policeEvent?.location?.name}
            </h3>
            <Separator className="my-3" />
            <div className="mb-3">
                <p className="text-gray-800">Inträffat: {event?.EventDate}</p>
                <p className="text-gray-800">Publicerades: {event?.policeEvent?.name.split(',')[0]?.trim()}</p>
            </div>
            <Separator className="my-3" />
            <a href={`https://polisen.se/${event?.policeEvent?.url}`} className="text-blue-500 hover:underline block mb-3">
                Se händelse på polisens hemsida
            </a>
            <Separator className="my-3" />
            <p className="text-gray-700">{event?.policeEvent?.summary}</p>
        </div>
    );
};

export default CurrentEvent;

