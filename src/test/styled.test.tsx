import { createSerializer } from "@emotion/jest";
import styled from "@emotion/styled";
import { render, screen } from "@testing-library/react";

expect.addSnapshotSerializer(createSerializer());

test("Render with @emotion", () => {
	const H1 = styled.h1`
		float: left;
	`;

	render(<H1>Hello World</H1>);

	expect(screen.getByRole("heading", { level: 1 })).toHaveStyle({
		float: "left",
	});
});
