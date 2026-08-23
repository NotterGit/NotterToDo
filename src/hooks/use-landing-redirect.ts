import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LandingRedirectStore } from "@/config/types/stores.types";
import { COOKIE_KEYS, STORAGE_KEYS } from "@/config/const/app.const";

function setCookieValue(value: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEYS.LANDING_REDIRECT}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export const useLandingRedirect = create<LandingRedirectStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      setEnabled: (enabled: boolean) => {
        setCookieValue(enabled);
        set({ enabled });
      },
      toggle: () => {
        const next = !get().enabled;
        setCookieValue(next);
        set({ enabled: next });
      },
    }),
    {
      name: STORAGE_KEYS.LANDING_REDIRECT,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setCookieValue(state.enabled);
        }
      },
    }
  )
);
