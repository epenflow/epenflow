import { createPortal } from "react-dom";
import { useRender } from "@base-ui/react";
import { useIsMounted } from "#/hooks/use-is-mounted.ts";

export function Portal({
  render,
  container: containerProp,
  ...props
}: useRender.ComponentProps<"div"> & {
  container?: Element | DocumentFragment | null;
}) {
  const mounted = useIsMounted();
  const container = containerProp ?? (mounted ? document.body : null);
  const children = useRender({ render, defaultTagName: "div", props });

  if (!container) return null;

  return createPortal(children, container);
}
