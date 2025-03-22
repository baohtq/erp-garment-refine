/**
 * DEPRECATED: This provider is deprecated and should not be used.
 * Please use the provider in /providers/auth instead.
 * 
 * This file is kept for compatibility with existing code but will be removed in the future.
 */

"use client";

import { authProviderClient } from "./auth-provider.client";

// Re-export from the new location
export { useAuth } from '@/providers/auth';

// For backwards compatibility
export const authProvider = authProviderClient; 