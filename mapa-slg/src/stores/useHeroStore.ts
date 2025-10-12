// store/useHeroStore.ts
import { create } from "zustand";

interface HeroState {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const initialVisible =
  typeof window !== "undefined"
    ? sessionStorage.getItem("heroSeen") !== "true"
    : true;

export const useHeroStore = create<HeroState>((set) => ({
  isVisible: initialVisible,
  setIsVisible: (visible) => set({ isVisible: visible }),
}));
