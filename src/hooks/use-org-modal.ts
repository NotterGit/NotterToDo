import { create } from "zustand";
import type { OrgModalStore } from "@/config/types/stores.types";

export const useOrgModal = create<OrgModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
