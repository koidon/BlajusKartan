export type EventResponse = {
  data: EventEntity[];
  message: string;
  status: boolean;
};

export type EventEntity = {
  id: number;
  eventDate: string;
  policeEvent: PoliceEvent;
};

export type PoliceEvent = {
  id: number;
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

export type EventIdResponse = {
  data: EventEntity;
  message: string;
  status: boolean;
};


