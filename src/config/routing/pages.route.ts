export const pages = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    SELECT_ORG: "/auth/select-org",
  },
  SELECT_ORG: "/select-org",
  ORGANIZATION: (id?: string) => (id ? `/organization/${id}` : "/organization"),
  ORGANIZATION_ACTIVITY: (id: string) => `/organization/${id}/activity`,
  ORGANIZATION_SETTINGS: (id: string) => `/organization/${id}/settings`,
  ORGANIZATION_CLERK_PATTERN: "/organization/:id",
  BOARD: (id: string) => `/board/${id}`,
} as const;
