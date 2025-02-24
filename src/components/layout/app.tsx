import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import { withLazy, withOptional } from "~/lib/utils";

const App: React.FC = () => {
  const { TanstackDevTools, FPSStats, Navbar } = resources;
  return (
    <React.Suspense>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <Navbar />
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
    withLazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    ),
    import.meta.env.DEV,
  ),
  Navbar: withLazy(() => import("~/components/layout/navbar")),
  FPSStats: withLazy(() => import("~/components/base/fps-stats")),
};
