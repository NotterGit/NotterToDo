import { create } from "zustand";
import type { CardRenameStore } from "@/config/types/stores.types";

export const useCardRename = create<CardRenameStore>((set) => ({
  renamingCardIds: {},
  startRenaming: (id: string) =>
    set((state) => ({
      renamingCardIds: {
        ...state.renamingCardIds,
        [id]: true,
      },
    })),
  stopRenaming: (id: string) =>
    set((state) => {
      const copy = { ...state.renamingCardIds };
      delete copy[id];
      return { renamingCardIds: copy };
    }),
}));
