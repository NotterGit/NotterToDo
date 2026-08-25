export const MAX_FREE_BOARDS = 5;
export const MAX_FREE_PUBLIC_BOARDS = 3;
export const AUDIT_LOG_LIMIT = 3;
export const FREE_AUDIT_LOG_LIMIT = 20;
export const FREE_CARD_AUDIT_LOG_LIMIT = 3;
export const EXTENDED_CARD_AUDIT_LOG_LIMIT = 50;

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

export const isDiamondPlan = (premium?: number | null): boolean => {
  return premium === 2;
};

export const MAX_UPLOAD_SIZE_MB = 2;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const hasExtendedAuditLog = (premium?: number | null): boolean => {
  return premium === 1 || premium === 2;
};

export const hasCustomBackgrounds = (premium?: number | null): boolean => {
  return premium === 1 || premium === 2;
};


