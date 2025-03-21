"use client";

import { useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * Custom hook to provide a consistent Supabase client across components
 * This ensures we always use the environment variables correctly
 */
export function useSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Memoize the client to avoid recreating it on every render
  const supabase = useMemo(() => {
    // Log information for debugging
    console.log('Initializing Supabase client with URL:', supabaseUrl);
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing! URL:', supabaseUrl, 'Key present:', !!supabaseKey);
    }
    
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: 'erp-garment-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'erp-garment',
        },
      },
    });
  }, [supabaseUrl, supabaseKey]);
  
  return supabase;
}

export default useSupabase; 