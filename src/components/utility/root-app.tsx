import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import router from "~/lib/router";
import { disableReactDevTools } from "~/lib/utils";

const InnerRoot = () => {
  return <RouterProvider router={router()} />;
};

const RootApp: React.FC = () => {
  if (import.meta.env.DEV) {
    return (
      <React.StrictMode>
        <InnerRoot />
      </React.StrictMode>
    );
  }

  disableReactDevTools();

  return <InnerRoot />;
};

export default RootApp;
