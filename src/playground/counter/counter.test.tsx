import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Counter from "#/playground/counter/counter.tsx";

describe("Counter Component", () => {
  it("renders the initial count of 0", () => {
    render(<Counter />);

    const heading = screen.getByText("Current Count: 0");
    expect(heading).toBeInTheDocument();
  });

  it("increments the count when the button is clicked", () => {
    render(<Counter />);

    const button = screen.getByRole("button", { name: "Increment" });

    fireEvent.click(button);

    const updatedHeading = screen.getByText("Current Count: 1");
    expect(updatedHeading).toBeInTheDocument();
  });
});
