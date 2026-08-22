import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BoardBlurStore } from "@/config/types/stores.types";

export const useBoardBlur = create<BoardBlurStore>()(
  persist(
    (set) => ({
      blur: 0,
      setBlur: (blur: number) =>
        set({ blur: Math.min(100, Math.max(0, Math.round(blur))) }),
    }),
    {
      name: "notter-board-blur-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
