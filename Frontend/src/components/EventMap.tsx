import { FeatureGroup, MapContainer, Marker, TileLayer } from "react-leaflet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog.tsx";
import { ElementRef, useEffect, useRef, useState } from "react";
import {  EventResponse } from "@/Models/policeEvent.ts";
import { cn } from "@/lib/utils.ts";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import Navigation from "@/components/Navigation.tsx";
import { useMediaQuery } from "usehooks-ts";
import InfoPanel from "@/components/InfoPanel.tsx";
import { iconMapping, warningIcon } from "@/Models/eventIcons.ts";
import { useCurrentEvent } from "@/Context/useCurrentEvent.ts";
type Props = {
  eventResponse: EventResponse | undefined;
}

export type GeojsonFeatures = {
  type: "FeatureCollection";
  features: Array<{
    type: string;
    id: number;
    properties: {
      name: string;
      date: string;
      type: string;
    };
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

const convertCoordinates = ((input: string): number[] => {
  const [latitude, longitude] = input.split(",").map(parseFloat);
  return [longitude, latitude];
})

const EventMap = ({eventResponse}: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const position = { lat: 63.1282, lng: 18.6435 };
  /*const [currentEvent, setCurrentEvent] = useState({
    id: 0,
    name: ""
  });*/
  const {currentEvent, setCurrentEvent} = useCurrentEvent();
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeojsonFeatures>({
    type: "FeatureCollection",
    features: []
  });
  const [isMapClicked, setIsMapClicked] = useState(false);

  const dialogTriggerRef = useRef<ElementRef<"button">>(null);

  useEffect(() => {
    if (eventResponse && eventResponse.data) {
      const features = eventResponse.data.map((eventEntity) => ({
        type: "Feature",
        id: eventEntity.id,
        properties: {
          name: eventEntity.policeEvent.name,
          type: eventEntity.policeEvent.type,
          date: eventEntity.EventDate
        },
        geometry: {
          type: "Point",
          coordinates: convertCoordinates(eventEntity.policeEvent.location.gps)
        }
      }));

      const filteredFeatures = features.filter((feature) => feature.properties.type != "Sammanfattning natt");

      setGeoJsonFeatures({
        type: "FeatureCollection",
        features: filteredFeatures
      });
    }
  }, [eventResponse]);

  const handleMapClick = () => {
    setIsMapClicked((prev) => !prev);
  };

  const handleMarkerClick = ({ id, name }: CurrentFeature) => {
    if (dialogTriggerRef.current && isMobile) {
      dialogTriggerRef.current.click();
    }
    setCurrentEvent({ id: id, name: name });
  };


  return (
    <>
    {!isMobile ? (
    <InfoPanel
      events={eventResponse}
    />
  ) : <><div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-10 mb-[4.25rem] transition-all duration-300 ease-in-out",
        isMapClicked && "transform translate-y-full opacity-0"
      )}
    >
      <Latest events={eventResponse} />
    </div>
      <div
      className={cn(
      "fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out",
      isMapClicked && "transform translate-y-full opacity-0"
      )}
    >
        <Navigation/>
    </div></>}
    <div className="absolute inset-0 w-full" onClick={handleMapClick}>

      <MapContainer
        center={position}
        zoom={5}
        scrollWheelZoom={true}
        style={{ zIndex: 0 }}
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
                  feature.geometry.coordinates[0]
                ]}
                eventHandlers={{
                  click: () =>
                    handleMarkerClick({
                      id: feature.id,
                      name: feature.properties.name
                    })
                }}
                icon={selectedIcon}
              >
                <Dialog>
                  <DialogTrigger ref={dialogTriggerRef}></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>{currentEvent.name}</DialogHeader>
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
};

export default EventMap;