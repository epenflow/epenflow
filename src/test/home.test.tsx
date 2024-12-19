import Home from "@/app/page";
import Desktop from "@/components/system/desktop";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Home Page", () => {
	it("render the home page", () => {
		render(<Home />);

		expect(screen.getByRole("main")).toBeInTheDocument();
	});
	it("render the desktop component", () => {
		const { getByText } = render(<Desktop />);
		expect(getByText(/HelloWorld/)).toBeInTheDocument();
		expect(getByText(/FuckTheWorld/));
	});
});
