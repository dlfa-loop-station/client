import { create } from "zustand";

const useLoadPitch = create((set) => ({
  pitch: [],
  setPitch: (data) => set({ pitch: data }),
}));

export default useLoadPitch;
