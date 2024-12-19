import dynamic from "next/dynamic";
import React from "react";

interface ComponentProcessProps {
	id: string;
}
type Processes = Record<
	string,
	{
		Component: React.ComponentType<ComponentProcessProps>;
		hasWindow?: boolean;
	}
>;
const directory: Processes = {
	HelloWorld: {
		Component: dynamic(() => import("@/components/apps/hello-world")),
		hasWindow: true,
	},
	FuckTheWorld: {
		Component: dynamic(() => import("@/components/apps/fuck-the-world")),
	},
};

export default directory;
