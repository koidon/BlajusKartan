import { create } from "zustand";

type CurrentEvent = {
  id: number | null;
  name: string;
}

type GenerationState = {
  currentEvent: CurrentEvent
  setCurrentEvent: (currentEvent: CurrentEvent) => void
}

export const useCurrentEvent = create<GenerationState>()((set) => ({
  currentEvent: {
    id: null,
    name: "",
  },
  setCurrentEvent: (currentEvent) => set({currentEvent})
}))