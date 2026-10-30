import { Rnd } from "react-rnd";
import { cn } from "cn";
import { mergeProps, useRender } from "@base-ui/react";

function Root({ render, className, ...props }: useRender.ComponentProps<"div">) {
  const children = useRender({
    render,
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn(className),
      },
      props,
    ),
  });

  return (
    <>
      <Rnd bounds="parent">{children}</Rnd>
    </>
  );
}
