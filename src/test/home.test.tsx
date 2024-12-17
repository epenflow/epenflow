import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import Desktop from "@/components/system/desktop";

describe("Home Page", () => {
	it("render the home page", () => {
		render(<Home />);

		expect(screen.getByRole("main")).toBeInTheDocument();
	});
	it("render the desktop component", () => {
		const { getByRole, getByText } = render(<Desktop />);
		expect(getByRole("heading")).toBeInTheDocument();
		expect(getByText(/Hello World/)).toBeInTheDocument();
	});
});
