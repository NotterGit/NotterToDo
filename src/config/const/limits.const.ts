export const MAX_FREE_BOARDS = 5;
export const MAX_FREE_PUBLIC_BOARDS = 3;
export const AUDIT_LOG_LIMIT = 3;

export interface PlanLimits {
  name: "Free" | "Amber" | "Diamond";
  boards: number;
  publicBoards: number;
  isUnlimitedBoards?: boolean;
}

export const PERSONAL_PLAN_LIMITS: Record<number, PlanLimits> = {
  0: {
    name: "Free",
    boards: 5,
    publicBoards: 3,
  },
  1: {
    name: "Amber",
    boards: 25,
    publicBoards: 25,
  },
  2: {
    name: "Diamond",
    boards: 1000,
    publicBoards: 100,
    isUnlimitedBoards: true,
  },
};

export const TEAM_PLAN_LIMITS: Record<number, PlanLimits> = {
  0: {
    name: "Free",
    boards: 5,
    publicBoards: 3,
  },
  1: {
    name: "Amber",
    boards: 50,
    publicBoards: 50,
  },
  2: {
    name: "Diamond",
    boards: 1000,
    publicBoards: 100,
    isUnlimitedBoards: true,
  },
};

export const getPlanLimits = (
  premium?: number | null,
  isOrg = false
): PlanLimits => {
  const limitsMap = isOrg ? TEAM_PLAN_LIMITS : PERSONAL_PLAN_LIMITS;
  if (premium === undefined || premium === null || !(premium in limitsMap)) {
    return limitsMap[0];
  }
  return limitsMap[premium];
};
