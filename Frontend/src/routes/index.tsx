import { FileRoute } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import { FeatureGroup, MapContainer, Marker, TileLayer } from "react-leaflet";
import useGetPoliceEvents from "@/Hooks/policeEvent/useGetPoliceEvents.tsx";
import { ElementRef, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useMediaQuery } from "usehooks-ts";
import InfoPanel from "@/components/InfoPanel.tsx";

export const Route = new FileRoute("/").createRoute({
  component: IndexComponent,
});

type GeojsonFeature = {
  type: "FeatureCollection";
  features: Array<{
    type: string;
    id: number;
    properties: {
      name: string;
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

function convertCoordinates(input: string): number[] {
  const [latitude, longitude] = input.split(",").map(parseFloat);
  return [longitude, latitude];
}

function IndexComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const datespan = "2023-12-11";
  const { data: eventResponse, isLoading } = useGetPoliceEvents(datespan);
  const position = { lat: 63.1282, lng: 18.6435 };
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeojsonFeature>({
    type: "FeatureCollection",
    features: [],
  });
  const [currentFeature, setCurrentFeature] = useState<CurrentFeature>({
    id: 0,
    name: "",
  });

  const dialogTriggerRef = useRef<ElementRef<"button">>(null);

  useEffect(() => {
    if (eventResponse && eventResponse.data) {
      const features = eventResponse.data.map((policeEvent) => ({
        type: "Feature",
        id: policeEvent.policeEvent.id,
        properties: {
          name: policeEvent.policeEvent.name,
        },
        geometry: {
          type: "Point",
          coordinates: convertCoordinates(policeEvent.policeEvent.location.gps),
        },
      }));

      setGeoJsonFeatures({
        type: "FeatureCollection",
        features: features,
      });
    }
  }, [eventResponse]);

  const handleMarkerClick = ({ id, name }: CurrentFeature) => {
    if (dialogTriggerRef.current && isMobile) {
      dialogTriggerRef.current.click();
    } else {
      setCurrentFeature({ id: id, name: name });
    }
  };

  if (isLoading) {
    return "Laddar...";
  }

  return (
    <>
      <InfoPanel id={currentFeature.id} name={currentFeature.name} />
      <div className="absolute inset-0 w-full">
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
                >
                  <Dialog>
                    <DialogTrigger ref={dialogTriggerRef}></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>{feature.properties.name}</DialogHeader>
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
