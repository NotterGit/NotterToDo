import { create } from "zustand";
import type { SettingsModalStore } from "@/config/types/stores.types";

export const useSettingsModal = create<SettingsModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
