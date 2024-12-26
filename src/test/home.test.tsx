import Home from "@/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Home Page", () => {
	it("render the home page", () => {
		render(<Home />);

		expect(screen.getByRole("main")).toBeInTheDocument();
	});
	// it("render the desktop component", () => {
	// 	const { getByText } = render(<Desktop />);
	// 	expect(getByText(/HelloWorld/)).toBeInTheDocument();
	// 	expect(getByText(/FuckTheWorld/));
	// });

	// it("should render dynamic import", () => {
	// 	// const { getByText } = render(
	// 	// 	Object.entries(directory).map(([id, { Component }]) => (
	// 	// 		<Component id={id} key={id} />
	// 	// 	))
	// 	// );
	// 	const { getByText } = render(
	// 		<directory.HelloWorld.Component id="HelloWorld" />
	// 	);
	// 	expect(getByText(/HelloWorld/)).toBeInTheDocument();
	// });
});
