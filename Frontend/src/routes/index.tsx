import {FileRoute} from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import {FeatureGroup, MapContainer, Marker, TileLayer} from "react-leaflet";
import useGetPoliceEvents from "@/Hooks/policeEvent/useGetPoliceEvents.tsx";
import {ElementRef, useEffect, useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {useMediaQuery} from "usehooks-ts";
import InfoPanel from "@/components/InfoPanel.tsx";
import dayjs from "dayjs";
import * as signalR from "@microsoft/signalr";
import {EventEntity} from "@/Models/policeEvent.ts";
import {useQueryClient} from "@tanstack/react-query";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import {cn} from "@/lib/utils.ts";
import Navigation from "@/components/Navigation.tsx";
import {renderToString} from "react-dom/server";
import {FaGun} from "react-icons/fa6";
import {FaRadiation} from "react-icons/fa";
import {GiTrafficCone} from "react-icons/gi";
import {FaMask} from "react-icons/fa";
import {FaBomb} from "react-icons/fa";
import {GiBowieKnife} from "react-icons/gi";
import {FaFire} from "react-icons/fa";
import {FaBeer} from "react-icons/fa";
import {FaSyringe} from "react-icons/fa";
import {FaFistRaised} from "react-icons/fa";
import {IoIosWarning} from "react-icons/io";
import {FaSkull} from "react-icons/fa";
import {FaMasksTheater} from "react-icons/fa6";
import {PiSirenFill} from "react-icons/pi";
import L from "leaflet";

const trafficIcon = L.divIcon({
    className: "traffic-cone",
    html: renderToString(<GiTrafficCone className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const gunIcon = L.divIcon({
    html: renderToString(<FaGun className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const envIcon = L.divIcon({
    html: renderToString(<FaRadiation className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const thiefIcon = L.divIcon({
    html: renderToString(<FaMask className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const bombIcon = L.divIcon({
    html: renderToString(<FaBomb className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const knifeIcon = L.divIcon({
    html: renderToString(<GiBowieKnife className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const fireIcon = L.divIcon({
    html: renderToString(<FaFire className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const beerIcon = L.divIcon({
    html: renderToString(<FaBeer className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const drugIcon = L.divIcon({
    html: renderToString(<FaSyringe className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const fistIcon = L.divIcon({
    html: renderToString(<FaFistRaised className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const deadIcon = L.divIcon({
    html: renderToString(<FaSkull className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const fraudIcon = L.divIcon({
    html: renderToString(<FaMasksTheater className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const sirenIcon = L.divIcon({
    html: renderToString(<PiSirenFill className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});
const warningIcon = L.divIcon({
    html: renderToString(<IoIosWarning className="w-[32px] h-[32px]"/>),
    iconSize: [32, 32],
});

const iconMapping: Record<string, L.DivIcon> = {
    //traffic
    "Trafikbrott": trafficIcon,
    "Trafikhinder": trafficIcon,
    "Trafikkontroll": trafficIcon,
    "Trafikolycka": trafficIcon,
    "Trafikolycka, personskada": trafficIcon,
    "Trafikolycka, singel": trafficIcon,
    "Trafikolycka, smitning från": trafficIcon,
    "Trafikolycka, vilt": trafficIcon,
    "Olovlig körning": trafficIcon,
    //gun
    "Vapenlagen": gunIcon,
    "Rån väpnat": thiefIcon,
    "Olaga hot": gunIcon,
    "Skottlossning": gunIcon,
    "Skottlossning, misstänkt": gunIcon,
    //robber
    "Rån": thiefIcon,
    "Rån övrigt": thiefIcon,
    "Rån, försök": thiefIcon,
    "Stöld": thiefIcon,
    "Stöld, försök": thiefIcon,
    "Stöld/inbrott": thiefIcon,
    "Inbrott": thiefIcon,
    "Inbrott, försök": thiefIcon,
    "Motorfordon, anträffat stulet": thiefIcon,
    "Motorfordon, stöld": thiefIcon,
    "Larm inbrott": thiefIcon,
    "Häleri": thiefIcon,
    //environement
    "Spridning smittsamma kemikalier": envIcon,
    "Miljöbrott": envIcon,
    "Naturkatastrof": envIcon,
    //bomb
    "Bombhot": bombIcon,
    "Detonation": bombIcon,
    //knife
    "Knivlagen": knifeIcon,
    //fire
    "Brand": fireIcon,
    "Brand automatlarm": fireIcon,
    //alcohol
    "Alkohollagen": beerIcon,
    "Fylleri/LOB": beerIcon,
    "Rattfylleri": beerIcon,
    //drugs
    "Narkotikabrott": drugIcon,
    //abuse
    "Misshandel": fistIcon,
    "Misshandel, grov": fistIcon,
    "Ofog barn/ungdom": fistIcon,
    "Våld/hot mot tjänsteman": fistIcon,
    "Våldtäkt": fistIcon,
    "Våldtäkt, försök": fistIcon,
    "Vållande till kroppsskada": fistIcon,
    "Larm överfall": fistIcon,
    "Bråk": fistIcon,
    //death
    "Mord/dråp": deadIcon,
    "Mord/dråp, försök": deadIcon,
    "Anträffad död": deadIcon,
    //fraud
    "Berägeri": fraudIcon,
    "Missbruk av urkund": fraudIcon,
    "Förfalskningsbrott": fraudIcon,
    //siren
    "Varningslarm/haveri": sirenIcon,
    "Räddningsinsats": sirenIcon,
    "Polisinsats/kommendering": sirenIcon,
    "Ordningslagen": sirenIcon,
    "Kontroll person/fordon": sirenIcon,
    "Fjällräddning": sirenIcon,
    "Uppdatering": sirenIcon,
};


type FeatureProperties = {
    name: string;
    type: string;
};

export const Route = new FileRoute("/").createRoute({
    component: IndexComponent,
});

export type GeojsonFeatures = {
    type: "FeatureCollection";
    features: Array<{
        type: string;
        id: number;
        properties: FeatureProperties;
        geometry: {
            type: string;
            coordinates: number[];
        };
    }>;
};

type CurrentFeature = {
    id: number;
    name: string;
};

function convertCoordinates(input: string): number[] {
    const [latitude, longitude] = input.split(",").map(parseFloat);
    return [longitude, latitude];
}

function IndexComponent() {
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const datespan = dayjs().format("YYYY-MM-DD");
    const {data: eventResponse, isLoading} = useGetPoliceEvents(datespan);
    const position = {lat: 63.1282, lng: 18.6435};
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeojsonFeatures>({
        type: "FeatureCollection",
        features: [],
    });
    const [currentFeature, setCurrentFeature] = useState<CurrentFeature>({
        id: 0,
        name: "",
    });
    const [isMapClicked, setIsMapClicked] = useState(false);

    const dialogTriggerRef = useRef<ElementRef<"button">>(null);

    useEffect(() => {
        if (eventResponse && eventResponse.data) {
            const features = eventResponse.data.map((policeEvent) => ({
                type: "Feature",
                id: policeEvent.policeEvent.id,
                properties: {
                    name: policeEvent.policeEvent.name,
                    type: policeEvent.policeEvent.type,
                    date: policeEvent.EventDate,
                },
                geometry: {
                    type: "Point",
                    coordinates: convertCoordinates(policeEvent.policeEvent.location.gps),
                },
            }));

            features.sort((a, b) =>
                a.properties.name.localeCompare(b.properties.name),
            );

            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: features,
            });
        }
    }, [eventResponse]);

    useEffect(() => {
        const initializeSignalRConnection = async () => {
            // Start SignalR connection when the component mounts
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5118/eventHub")
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Listen for real-time events
            try {
                await connection.start();
                connection.on("ReceiveEvents", (newEvents: EventEntity[]) => {
                    // Convert new events to GeoJSON features and update the state
                    const newFeatures = newEvents.map((policeEvent) => ({
                        type: "Feature",
                        id: policeEvent.policeEvent.id,
                        properties: {
                            name: policeEvent.policeEvent.name,
                            date: policeEvent.EventDate,
                        },
                        geometry: {
                            type: "Point",
                            coordinates: convertCoordinates(
                                policeEvent.policeEvent.location.gps,
                            ),
                        },
                    }));

                    newFeatures.sort((a, b) =>
                        a.properties.name.localeCompare(b.properties.name),
                    );

                    /*setGeoJsonFeatures((prevGeoJsonFeatures) => ({
                        type: "FeatureCollection",
                        features: [...prevGeoJsonFeatures.features, ...newFeatures],
                    }));*/
                    
                    queryClient.invalidateQueries({
                        queryKey: [`getPoliceEvents/${datespan}`],
                    });
                });
            } catch (error) {
                console.error("Error starting SignalR connection:", error);
            }

            // Clean up SignalR connection when the component unmounts
            return () => {
                connection.stop();
            };
        };

        (async () => {
            await initializeSignalRConnection();
        })();
    }, [setGeoJsonFeatures, datespan, queryClient]);

    const handleMapClick = () => {
        setIsMapClicked((prev) => !prev);
    };

    const handleMarkerClick = ({id, name}: CurrentFeature) => {
        if (dialogTriggerRef.current && isMobile) {
            dialogTriggerRef.current.click();
            setCurrentFeature({id: id,  name: name});
        } else {
            setCurrentFeature({id: id, name: name});
        }
    };

    if (isLoading) {
        return "Laddar...";
    }

    return (
        <>
            {!isMobile ? (
                <InfoPanel
                    id={currentFeature.id}
                    name={currentFeature.name}
                    geoJsonFeatures={geoJsonFeatures}
                />
            ) : (
                <>
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-10 mb-[4.25rem] transition-all duration-300 ease-in-out",
                            isMapClicked && "transform translate-y-full opacity-0",
                        )}
                    >
                        {" "}
                        <Latest geoJsonFeatures={geoJsonFeatures}/>
                    </div>
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out",
                            isMapClicked && "transform translate-y-full opacity-0",
                        )}
                    >
                        <Navigation/>
                    </div>
                </>
            )}

            <div className="absolute inset-0 w-full" onClick={handleMapClick}>
                <MapContainer
                    center={position}
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{zIndex: 0}}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geoJsonFeatures.features.map((feature) => {
                        const selectedIcon =
                            iconMapping[feature.properties.type] || warningIcon;
                        return (
                            <FeatureGroup key={feature.id}>
                                <Marker
                                    position={[
                                        feature.geometry.coordinates[1],
                                        feature.geometry.coordinates[0],
                                    ]}
                                    eventHandlers={{
                                        click: () =>
                                            handleMarkerClick({
                                                id: feature.id,
                                                name: feature.properties.name,
                                            }),
                                    }}
                                    icon={selectedIcon}
                                >
                                    <Dialog>
                                        <DialogTrigger ref={dialogTriggerRef}></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>{currentFeature.name}</DialogHeader>
                                            <DialogDescription></DialogDescription>
                                        </DialogContent>
                                    </Dialog>
                                </Marker>
                            </FeatureGroup>
                        );
                    })}
                </MapContainer>
            </div>
        </>
    );
}

export default IndexComponent;
