"use client";

import { useSyncAccount } from "@/hooks/use-sync-account";

export function SyncProvider() {
  useSyncAccount();
  return null;
}
