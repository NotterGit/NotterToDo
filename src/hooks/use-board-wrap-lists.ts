import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BoardWrapListsStore } from "@/config/types/stores.types";
import { STORAGE_KEYS } from "@/config/const/app.const";

export const useBoardWrapLists = create<BoardWrapListsStore>()(
  persist(
    (set, get) => ({
      wrapLists: false,
      setWrapLists: (wrapLists: boolean) => set({ wrapLists }),
      toggle: () => set({ wrapLists: !get().wrapLists }),
    }),
    {
      name: STORAGE_KEYS.BOARD_WRAP_LISTS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
