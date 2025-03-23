import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import { withLazy, withOptional } from "~/lib/utils";

const App: React.FC = () => {
  const { TanstackDevTools, FPSStats, AppHeader } = resources;
  return (
    <React.Suspense>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <AppHeader />
        <Outlet />
        <FPSStats width={160} bottom={32} right={32} />
        <TanstackDevTools />
      </ThemeProvider>
    </React.Suspense>
  );
};
export default App;

const resources = {
  TanstackDevTools: withOptional(
    withLazy(
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    ),
    import.meta.env.DEV,
  ),
  AppHeader: withLazy(import("~/layouts/app/app-header")),
  FPSStats: withLazy(import("~/components/base/fps-stats")),
};
