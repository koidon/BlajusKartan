import {FeatureGroup, MapContainer, Marker, Popup, TileLayer, ZoomControl} from "react-leaflet";
import {useEffect, useLayoutEffect, useState} from "react";
import {EventResponse} from "@/Models/policeEvent.ts";
import {cn} from "@/lib/utils.ts";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import Navigation from "@/components/Navigation.tsx";
import {useMediaQuery} from "usehooks-ts";
import InfoPanel from "@/components/InfoPanel.tsx";
import {iconMapping, popupIcons, WarningIcon, warningIcon} from "@/Models/eventIcons.ts";
import {useNavigate, useSearch} from "@tanstack/react-router";
import {Route as IndexRoute} from "@/routes";
import useGetEventById from "@/Hooks/policeEvent/useGetEventById.tsx";
import CurrentEvent from "@/components/infoPanelComponents/CurrentEvent.tsx";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from "dayjs";


type Props = {
    eventResponse: EventResponse;
}

export type GeojsonFeatures = {
    type: "FeatureCollection";
    coordinatesGroups: Array<Array<{
        type: string;
        id: number;
        properties: {
            type: string;
            eventDate: string
        };
        geometry: {
            type: string;
            coordinates: number[];
        };
    }>>;
    differentCoordinatesFeature: Array<{
        type: string;
        id: number;
        properties: {
            type: string;
            eventDate: string
        };
        geometry: {
            type: string;
            coordinates: number[];
        };
    }>;
};

const convertCoordinates = ((input: string): number[] => {
    const [latitude, longitude] = input.split(",").map(parseFloat);
    return [longitude, latitude];
})


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const EventMap = ({eventResponse}: Props) => {
    const navigate = useNavigate({from: IndexRoute.id})
    const {date} = useSearch({
        from: IndexRoute.id
    })
    const isMobile = useMediaQuery("(max-width: 768px)");
    const position = {lat: 63.1282, lng: 18.6435};
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeojsonFeatures>({
        type: "FeatureCollection",
        coordinatesGroups: [],
        differentCoordinatesFeature: [],
    });
    const {id} = useSearch({
        from: IndexRoute.id
    })
    const defaultEventId = eventResponse.data.length > 0 ? eventResponse.data[0].id ?? 0 : 0;
    const {data: event} = useGetEventById(date, id || defaultEventId);
    const [isMapClicked, setIsMapClicked] = useState(false);
    const [isEventSelected, setIsEventSelected] = useState(false);


    const [unmountMap, setunmountMap] = useState(false);
    useLayoutEffect(() => {
        setunmountMap(false);
        return () => {
            setunmountMap(true);
        };
    }, []);

    useEffect(() => {
        const features = eventResponse.data
            .filter((eventEntity) => eventEntity.policeEvent.type !== "Sammanfattning natt" && eventEntity.policeEvent.type !== "Sammanfattning kväll och natt")
            .map((eventEntity) => ({
                type: "Feature",
                id: eventEntity.id,
                properties: {
                    type: eventEntity.policeEvent.type,
                    eventDate: eventEntity.eventDate,
                },
                geometry: {
                    type: "Point",
                    coordinates: convertCoordinates(eventEntity.policeEvent.location.gps),
                }
            }));


        const groupedByCoordinates = features.reduce<Record<string, Array<typeof features[0]>>>((acc, feature) => {
            const key = feature.geometry.coordinates.join(',');
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(feature);
            return acc;
        }, {});

        const coordinatesGroups = Object.values(groupedByCoordinates).filter(
            (group) => group.length > 1
        );

        const differentCoordinatesFeature = features.filter((feature) => {
            const key = feature.geometry.coordinates.join(',');
            return groupedByCoordinates[key].length === 1;
        });

        setGeoJsonFeatures({
            type: "FeatureCollection",
            coordinatesGroups,
            differentCoordinatesFeature
        });
    }, [eventResponse]);

    const handleMapClick = () => {
        setIsMapClicked((prev) => !prev);
    };

    const handleMarkerClick = (id: number, date: string) => {
        setIsEventSelected(true);
        navigate({
            search: () => ({id: id, date: dayjs(date).format("YYYY-MM-DD")})
        }).then()
    };

    return (
        !unmountMap && (
            <>
                {!isMobile ? (
                    <InfoPanel
                        events={eventResponse}
                        event={event}
                    />
                ) : <>
                    {isEventSelected && (
                        <div className={cn(
                            "fixed bottom-0 left-0 right-0 z-10 mb-[4.25rem] transition-all duration-300 ease-in-out",
                            isMapClicked && "transform translate-y-full opacity-0"
                        )}>
                            <CurrentEvent event={event}/>
                        </div>
                    )
                    }
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-10 mb-[4.25rem] transition-all duration-300 ease-in-out",
                            isMapClicked && "transform translate-y-full opacity-0"
                        )}
                    >
                        <div className={cn(isEventSelected && "hidden")}>
                            <Latest events={eventResponse}/>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out",
                            isMapClicked && "transform translate-y-full opacity-0"
                        )}
                    >
                        <Navigation/>
                    </div>
                </>}

                <div className="absolute inset-0 w-full" onClick={handleMapClick}>
                    <MapContainer
                        center={position}
                        zoom={5}
                        scrollWheelZoom={true}
                        style={{zIndex: 0}}
                        zoomControl={false}
                    >
                        <ZoomControl position={"topright"}/>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {geoJsonFeatures.differentCoordinatesFeature.map((feature) => {
                            const selectedIcon =
                                iconMapping[feature.properties.type] || warningIcon;
                            return (
                                <FeatureGroup key={feature.id}>
                                    <Marker
                                        position={[
                                            feature.geometry.coordinates[1],
                                            feature.geometry.coordinates[0]
                                        ]}
                                        eventHandlers={{
                                            click: () =>
                                                handleMarkerClick(feature.id, feature.properties.eventDate)
                                        }}
                                        icon={selectedIcon}
                                    >
                                    </Marker>
                                </FeatureGroup>
                            )
                                ;
                        })}
                        {geoJsonFeatures.coordinatesGroups.map((feature, index) => {
                            return (
                                <FeatureGroup key={index}>
                                    <Marker
                                        position={[
                                            feature[0].geometry.coordinates[1],
                                            feature[0].geometry.coordinates[0]
                                        ]}
                                    >
                                        <Popup>
                                            <div className="flex">
                                                {geoJsonFeatures.coordinatesGroups[index].map((otherFeature) => {
                                                    const IconComponent =
                                                        popupIcons[otherFeature.properties.type] || WarningIcon;
                                                    return (
                                                        <IconComponent
                                                            className="w-[32px] h-[32px]"
                                                            key={otherFeature.id}
                                                            onClick={() => handleMarkerClick(otherFeature.id, otherFeature.properties.eventDate)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </Popup>
                                    </Marker>
                                </FeatureGroup>
                            );
                        })}
                    </MapContainer>
                </div>
                )
            </>
        )
    );
}

export default EventMap;