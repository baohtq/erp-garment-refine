"use client";

import { authProviderClient } from "./auth-provider.client";

// Tạo một phiên bản authProvider có sẵn để development
const authProviderWithDevMode = {
  ...authProviderClient,
  check: async () => {
    return {
      authenticated: true // Luôn trả về đã xác thực trong môi trường development
    };
  }
};

export const authProvider = authProviderWithDevMode; 