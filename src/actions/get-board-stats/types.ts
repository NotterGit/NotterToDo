import { BoardStats } from "@/config/types/api.types";

export interface GetBoardStatsInput {
  orgId: string;
}

export type GetBoardStatsOutput = BoardStats;
