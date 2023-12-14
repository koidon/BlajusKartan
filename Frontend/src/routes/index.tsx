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
import dayjs from "dayjs";
import * as signalR from "@microsoft/signalr";
import { EventEntity } from "@/Models/policeEvent.ts";
import { useQueryClient } from "@tanstack/react-query";
import Latest from "@/components/infoPanelComponents/Latest.tsx";
import { cn } from "@/lib/utils.ts";
import Navigation from "@/components/Navigation.tsx";

export const Route = new FileRoute("/").createRoute({
  component: IndexComponent,
});

export type GeojsonFeatures = {
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
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const datespan = dayjs().format("YYYY-MM-DD");
  const { data: eventResponse, isLoading } = useGetPoliceEvents(datespan);
  const position = { lat: 63.1282, lng: 18.6435 };
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

          setGeoJsonFeatures((prevGeoJsonFeatures) => ({
            type: "FeatureCollection",
            features: [...prevGeoJsonFeatures.features, ...newFeatures],
          }));
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
            <Latest geoJsonFeatures={geoJsonFeatures} />
          </div>
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out",
              isMapClicked && "transform translate-y-full opacity-0",
            )}
          >
            <Navigation />
          </div>
        </>
      )}

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

export default IndexComponent;
