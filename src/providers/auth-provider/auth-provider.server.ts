import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from '@/utils/supabase/server';

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    // For demonstration purposes, always return authenticated: true
    // This bypasses actual authentication for easier development and testing

    console.log("Auth check bypassed for demo purposes");
    
    return {
      authenticated: true
    };

    // Uncomment below for real authentication check
    /*
    const { data, error } = await createSupabaseServerClient().auth.getUser();
    const { user } = data;

    if (error) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
    */
  },
};
