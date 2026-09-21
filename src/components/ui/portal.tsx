import { createPortal } from "react-dom";
import { useRender } from "@base-ui/react";
import { useMounted } from "#/hooks/use-mounted.ts";

interface PortalProps extends useRender.ComponentProps<"div"> {
  container?: Element | DocumentFragment | null;
}

export function Portal({ render, container: containerProps, ...props }: PortalProps) {
  const mounted = useMounted();

  const container = containerProps ?? (mounted ? document.body : null);

  const children = useRender({ render, defaultTagName: "div", props: props });

  if (!container) return null;

  return createPortal(children, container);
}
