import { create } from "zustand";
import type { CardModalStore } from "@/config/types/stores.types";

export const useCardModal = create<CardModalStore>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));