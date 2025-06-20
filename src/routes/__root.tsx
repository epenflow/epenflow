import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import Navbar from "~/components/base/navbar";
import GSAPRegister from "~/components/utility/gsap";
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
      <>
        <React.Suspense>
          <GSAPRegister />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Navbar />
            <Outlet />
            <resources.FPSStats width={160} bottom={32} right={32} />
            <resources.TanstackDevTools />
          </ThemeProvider>
        </React.Suspense>
      </>
    );
  },
});
