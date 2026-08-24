export const API = {
  CARDS: {
    BY_ID: (cardId: string) => `/api/cards/${cardId}`,
    LOGS: (cardId: string) => `/api/cards/${cardId}/logs`,
  },
  BACKGROUNDS: "/api/backgrounds",
  BACKEND: {
    USERS: {
      BY_ID: (_id: string) => `users/by_id/${_id}`,
      BY_USERNAME: (username: string) => `users/by_username/${username}`,
      ADD: (_id: string) => `users/add/${_id}`,
      UPDATE: (_id: string) => `users/update/${_id}`,
    },
    ORGS: {
      BY_ID: (_id: string) => `orgs/by_id/${_id}`,
      BY_USERNAME: (username: string) => `orgs/by_username/${username}`,
      ADD: (_id: string) => `orgs/add/${_id}`,
      UPDATE: (_id: string) => `orgs/update/${_id}`,
    },
  },
} as const;

