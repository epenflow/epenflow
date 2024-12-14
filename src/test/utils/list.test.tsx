import List from "@/utils/list";
import { render, waitFor } from "@testing-library/react";

describe("List Test", () => {
	it("should render a collection of value", async () => {
		const data = [1, 2, 3, 4];
		const { findAllByAltText, getByTestId } = render(
			<List list={data}>
				{(value, key) => (
					<div key={key} data-testid="value">
						{value}
					</div>
				)}
			</List>
		);
		waitFor(() => {
			expect(findAllByAltText(/[1-4]/)).toBeInTheDocument();
			expect(getByTestId("value")).toBeVisible();
			expect(getByTestId("value")).toHaveLength(4);
		});
	});

	it("should throw an error if the 'list' prop isn't a valid array", () => {
		const data: any = "test";
		jest.spyOn(console, "error").mockImplementation(jest.fn());

		expect(() => {
			render(
				<List list={data}>
					{(value, key) => (
						<div key={key} data-testid="value">
							Test
						</div>
					)}
				</List>
			);
		}).toThrow('Expected an array for "list" props, but received a string');

		jest.resetAllMocks(); // Restore console.error
	});
});
