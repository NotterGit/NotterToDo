import { create } from "zustand"
import type { BoardPreviewStore } from "@/config/types/stores.types"

export const useBoardPreview = create<BoardPreviewStore>((set) => ({
  previewImage: null,
  setPreviewImage: (image: string | null) => set({ previewImage: image }),
  resetPreviewImage: () => set({ previewImage: null }),
}))
