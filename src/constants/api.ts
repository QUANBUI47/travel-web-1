export const API_ENDPOINTS = {
  V1: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      LOGOUT: "/api/v1/auth/logout",
      SESSION: "/api/v1/auth/session",
    },
    DESTINATIONS: {
      BASE: "/api/v1/destinations",
      BY_ID: (id: string) => `/api/v1/destinations/${id}`,
    },
    TOURS: {
      BASE: "/api/v1/tours",
      BY_ID: (id: string) => `/api/v1/tours/${id}`,
    },
  },
} as const;
