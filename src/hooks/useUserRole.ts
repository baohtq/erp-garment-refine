"use client";

import { useGetIdentity } from "@refinedev/core";
import { useState, useEffect } from "react";

// Interface for user roles
export interface IUserRole {
  isAdmin: boolean;
  isManager: boolean;
  isUser: boolean;
}

// Default roles when no role is assigned
const defaultRoles: IUserRole = {
  isAdmin: false,
  isManager: false,
  isUser: true,
};

export const useUserRole = (): IUserRole => {
  const [roles, setRoles] = useState<IUserRole>(defaultRoles);

  // Use the useGetIdentity hook from Refine with proper error handling
  const { data: user, isLoading, error } = useGetIdentity<{ role?: string }>();

  useEffect(() => {
    // Function to determine user roles based on role string
    const determineRoles = (role?: string): IUserRole => {
      if (!role) return defaultRoles;

      switch (role.toLowerCase()) {
        case "admin":
          return { isAdmin: true, isManager: true, isUser: true };
        case "manager":
          return { isAdmin: false, isManager: true, isUser: true };
        default:
          return { isAdmin: false, isManager: false, isUser: true };
      }
    };

    // Attempt to get roles from API/auth
    if (!isLoading && !error && user) {
      const userRole = user.role;
      const newRoles = determineRoles(userRole);
      
      try {
        // Cache roles in localStorage
        localStorage.setItem("userRoles", JSON.stringify(newRoles));
      } catch (e) {
        console.error("Failed to save roles to localStorage", e);
      }
      
      setRoles(newRoles);
    } else {
      // If API fails, try to get from localStorage as fallback
      try {
        const savedRoles = localStorage.getItem("userRoles");
        if (savedRoles) {
          setRoles(JSON.parse(savedRoles));
        }
      } catch (e) {
        console.error("Failed to retrieve roles from localStorage", e);
        setRoles(defaultRoles);
      }
    }
  }, [isLoading, error, user]);

  return roles;
}; 