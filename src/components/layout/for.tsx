import React from "react";
import { withMemo } from "~/lib/utils";

type ForProps<TFor> = {
  each?: TFor[];
  children?: (value: TFor, index: number) => React.ReactNode;
};
const For = withMemo(<TFor,>({ each, children }: ForProps<TFor>) => {
  return each?.map((value, index) => children?.(value, index));
});
export default For;
