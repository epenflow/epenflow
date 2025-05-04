import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import { withLazy, withOptional } from "~/lib/utils";

const resources = {
  TanstackDevTools: withOptional(
    withLazy(
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    ),
    import.meta.env.DEV,
  ),
  FPSStats: withLazy(import("~/components/base/fps-stats")),
};

export const Route = createRootRoute({
  component: () => {
    return (
      <React.Suspense>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Outlet />
          <resources.FPSStats />
          <resources.TanstackDevTools />
        </ThemeProvider>
      </React.Suspense>
    );
  },
});
