import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import { withLazy, withOptional } from "~/lib/utils";

const RootPage: React.FC = () => {
  const { TanstackDevTools, FPSStats } = resources;
  return (
    <React.Suspense>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <Outlet />
        <FPSStats width={160} bottom={32} right={32} />
        <TanstackDevTools />
      </ThemeProvider>
    </React.Suspense>
  );
};
export default RootPage;

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
