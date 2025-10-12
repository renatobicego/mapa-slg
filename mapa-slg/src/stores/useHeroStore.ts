// store/useHeroStore.ts
import { create } from "zustand";

interface HeroState {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  isVisible: sessionStorage?.getItem("heroSeen") !== "true",
  setIsVisible: (visible) => set({ isVisible: visible }),
}));
