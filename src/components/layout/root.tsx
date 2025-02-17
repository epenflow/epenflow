import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import router from "~/lib/router";

const Root: React.FC = () => {
  const InnerRoot = () => {
    return <RouterProvider router={router()} />;
  };

  if (import.meta.env.DEV) {
    return (
      <React.StrictMode>
        <InnerRoot />
      </React.StrictMode>
    );
  }

  return <InnerRoot />;
};

export default Root;
