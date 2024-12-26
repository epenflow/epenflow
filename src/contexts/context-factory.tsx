"use client";
import React from "react";

type FC<T = Record<string, unknown>> = (
	props: React.PropsWithChildren<T>
) => React.ReactNode;

type ContextFactoryReturnType<T> = {
	Provider: React.MemoExoticComponent<FC>;
	useContext: () => T;
};
function contextFactory<T>(
	useContextState: () => T,
	ContextComponent?: React.ReactNode
): ContextFactoryReturnType<T> {
	const Context: React.Context<T> = React.createContext({} as T);
	const RenderContextComponent = React.memo(() => ContextComponent);
	RenderContextComponent.displayName = "RenderContextComponent";

	const Provider = React.memo<FC>(({ children }) => {
		return (
			<Context value={useContextState()}>
				{children}
				<RenderContextComponent />
			</Context>
		);
	});
	Provider.displayName = "Provider";

	return {
		Provider,
		useContext: () => React.useContext(Context),
	};
}
export default contextFactory;
