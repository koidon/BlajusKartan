export type EventResponse = {
  data: EventEntity[];
  message: string;
  status: boolean;
};

export type EventEntity = {
  id: number;
  fetchedAt: string;
  policeEvent: PoliceEvent;
};

export type PoliceEvent = {
  id: number;
  datetime: string;
  name: string;
  summary: string;
  url: string;
  type: string;
  location: Location;
};

export type Location = {
  name: string;
  gps: string;
};

export type GeoJsonObject = {
  type: string;
  properties: {
    name: string;
    amenity: string;
    popupContent: string;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
};
