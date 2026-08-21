export const pages = {
  ROOT: "/",
  DASHBOARD: (id?: string) => (id ? `/dashboard/${id}` : "/dashboard"),
  DASHBOARD_ACTIVITY: (id: string) => `/dashboard/${id}/activity`,
  DASHBOARD_SETTINGS: (id: string) => `/dashboard/${id}/settings`,
  DASHBOARD_CLERK_PATTERN: "/dashboard/:id",
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    SELECT_ORG: "/auth/select-org",
  },
  SELECT_ORG: "/auth/select-org",
  ORGANIZATION: (id?: string) => (id ? `/dashboard/${id}` : "/dashboard"),
  ORGANIZATION_ACTIVITY: (id: string) => `/dashboard/${id}/activity`,
  ORGANIZATION_SETTINGS: (id: string) => `/dashboard/${id}/settings`,
  ORGANIZATION_CLERK_PATTERN: "/dashboard/:id",
  BOARD: (id: string) => `/board/${id}`,
} as const;
