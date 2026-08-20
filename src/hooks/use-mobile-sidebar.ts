import { create } from "zustand";
import type { MobileSidebarStore } from "@/config/types/stores.types";

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));