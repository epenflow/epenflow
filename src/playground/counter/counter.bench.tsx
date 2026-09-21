import { test } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import Counter from "#/playground/counter/counter.tsx";

test("Counter Component Performance", async ({ bench }) => {
  await bench.compare(
    bench("render the counter", () => {
      render(<Counter />);
      cleanup();
    }),

    bench("render and interact with the counter", () => {
      const { getByRole } = render(<Counter />);

      const button = getByRole("button", { name: "Increment" });
      fireEvent.click(button);

      cleanup();
    }),
  );
});
