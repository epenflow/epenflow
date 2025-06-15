import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import FPSStats from "~/components/base/fps-stats";
import Navbar from "~/components/base/navbar";
import GSAPRegister from "~/components/utility/gsap";
import { withLazy, withOptional } from "~/lib/utils";

const TanstackDevTools = withOptional(
  withLazy(
    import("@tanstack/react-router-devtools").then((res) => ({
      default: res.TanStackRouterDevtools,
    })),
  ),
  import.meta.env.DEV,
);

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Suspense>
          <GSAPRegister />
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
        </Suspense>
      </>
    );
  },
});
