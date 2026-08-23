export const apiRoutes = {
  CARDS: {
    BY_ID: (cardId: string) => `/api/cards/${cardId}`,
    LOGS: (cardId: string) => `/api/cards/${cardId}/logs`,
  },
  BACKGROUNDS: "/api/backgrounds",
} as const;
