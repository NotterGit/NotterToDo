"use client";

import { useEffect } from "react";

export function PwaProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => {
          console.error("Service Worker registration error:", error);
        });
    }
  }, []);

  return <>{children}</>;
}
