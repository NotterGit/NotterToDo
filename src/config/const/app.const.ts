export const APP_NAME = "Notter ToDo";
export const APP_DESCRIPTION = "Создавайте задачи, планируйте, действуйте. Это — Notter ToDo";
export const APP_VERSION = "0.1.0";

export const STORAGE_KEYS = {
  SIDEBAR: "t-sidebar-state",
  MOBILE_SIDEBAR: "t-sidebar-mobile-state",
  LANDING_REDIRECT: "notter-landing-redirect-storage",
  BOARD_BLUR: "notter-board-blur-storage",
} as const;

export const COOKIE_KEYS = {
  LANDING_REDIRECT: "notter_landing_redirect",
} as const;
