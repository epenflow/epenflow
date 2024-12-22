import contextFactory from "@/contexts/context-factory";
import React from "react";

function useSessionState() {
	const [sessionLoaded, setSessionLoaded] = React.useState<boolean>(false);
	return {
		sessionLoaded,
		setSessionLoaded,
	};
}
export const { Provider: SessionProvider, useContext: useSession } =
	contextFactory(useSessionState);
