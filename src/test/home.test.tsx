import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
	it("render the home page", () => {
		render(<Home />);

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText("Home", { exact: true })).toBeInTheDocument();
	});
});
