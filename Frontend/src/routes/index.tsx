import { FileRoute } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";



export const Route = new FileRoute("/").createRoute({
  component: IndexComponent,
});

function IndexComponent() {
  const position = [51.505, -0.09]
  return (
      <div className={`absolute inset-0 w-full`}>
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ zIndex: 0}}
        >
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
  );
}
