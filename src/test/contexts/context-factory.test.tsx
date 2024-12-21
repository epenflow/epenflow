import contextFactory from "@/contexts/context-factory";
import {
	cleanup,
	fireEvent,
	render,
	renderHook,
	screen,
} from "@testing-library/react";
import React from "react";
import { toMatchDiffSnapshot } from "snapshot-diff";

expect.extend({ toMatchDiffSnapshot });
describe("Context Factory Test", () => {
	function useMockContextState() {
		const [isLoading, setLoading] = React.useState<boolean>(false);

		return {
			isLoading,
			setLoading,
		};
	}

	const { Provider, useContext } = contextFactory(useMockContextState);

	const RenderProvider = (children: React.ReactNode) => {
		return render(<Provider>{children}</Provider>);
	};

	const UnitComponent = () => {
		const { isLoading, setLoading } = useContext();
		function toggle() {
			setLoading((prev) => !prev);
		}
		return (
			<main>
				<h1>Home</h1>
				<h1>{String(isLoading)}</h1>
				<button type="button" onClick={toggle}>
					toggle
				</button>
			</main>
		);
	};

	afterAll(cleanup);

	it("should render children and provide context value", () => {
		const { getByRole, getByText } = RenderProvider(<UnitComponent />);
		expect(getByRole("main")).toBeInTheDocument();
		expect(getByText(/false/)).toBeInTheDocument();
	});

	it("should return hook value", () => {
		const { result } = renderHook(() => useContext(), {
			wrapper: ({ children }) => <Provider>{children}</Provider>,
		});
		expect(result.current).toBeInstanceOf(Object);
		expect(result.current).toEqual(
			expect.objectContaining({
				isLoading: false,
				setLoading: expect.any(Function),
			})
		);
	});
	it("should render optional context component if provided", () => {
		const CustomContextComponent = () => (
			<span>Test Context Component</span>
		);
		const { Provider: CustomProvider } = contextFactory(
			useMockContextState,
			<CustomContextComponent />
		);
		render(
			<CustomProvider>
				<UnitComponent />
			</CustomProvider>
		);
		expect(screen.getByText(/Test Context Component/)).toBeInTheDocument();
	});

	it("should update the context state", () => {
		const { getByRole, getByText, asFragment } = RenderProvider(
			<UnitComponent />
		);
		const firstRender = asFragment();
		expect(getByText(/false/)).toBeInTheDocument();
		fireEvent.click(getByRole("button"));
		expect(getByText(/true/)).toBeInTheDocument();
		expect(firstRender).toMatchDiffSnapshot(asFragment());
	});
});
