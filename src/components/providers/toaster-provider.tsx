"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#000000",
          border: "1px solid #e4e4e7",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#000000",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#000000",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};
