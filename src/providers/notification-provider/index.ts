"use client";

import { NotificationProvider } from "@refinedev/core";
import { toast } from "react-toastify";

interface CustomNotificationProvider extends NotificationProvider {
  open: (params: {
    message: string;
    description?: string;
    type?: "success" | "error" | "progress" | "info" | "warning";
    key?: string;
  }) => string | number;
}

export const notificationProvider: CustomNotificationProvider = {
  open: ({ message, type, key }) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else if (type === "info") {
      toast.info(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else {
      toast(message);
    }
    return key || Date.now().toString();
  },
  close: (key) => {
    toast.dismiss(key);
    return key;
  },
}; 