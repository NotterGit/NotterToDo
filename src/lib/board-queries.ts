import { cache } from "react";
import { db } from "@/lib/db";

/**
 * Cached board query per React render pass to deduplicate
 * calls across generateMetadata, layout, and page components
 */
export const getCachedBoard = cache(async (boardId: string) => {
  return db.board.findUnique({
    where: {
      id: boardId,
    },
  });
});
