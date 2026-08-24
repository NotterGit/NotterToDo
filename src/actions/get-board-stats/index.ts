"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { GetBoardStatsInput, GetBoardStatsOutput } from "./types";

export const getBoardStats = async ({
  orgId,
}: GetBoardStatsInput): Promise<GetBoardStatsOutput | null> => {
  const { userId } = await auth();

  if (!userId || !orgId) {
    return null;
  }

  try {
    const [boards, publicBoards] = await Promise.all([
      db.board.count({
        where: {
          orgId,
        },
      }),
      db.board.count({
        where: {
          orgId,
          public: true,
        },
      }),
    ]);

    return {
      boards,
      publicBoards,
    };
  } catch (error) {
    console.error("[GET_BOARD_STATS_ERROR]", error);
    return null;
  }
};
