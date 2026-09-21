import { hydrateRoot } from "react-dom/client";
import { startTransition, StrictMode } from "react";

import { StartClient } from "@tanstack/react-start/client";

startTransition(() => {
  hydrateRoot(
    document,
    import.meta.env.DEV ? (
      <StrictMode>
        <StartClient />
      </StrictMode>
    ) : (
      <StartClient />
    ),
  );
});
