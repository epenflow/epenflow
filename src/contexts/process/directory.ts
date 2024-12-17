import dynamic from "next/dynamic";
import React from "react";

interface ComponentProcessProps {
	id: string;
}
type Processes = Record<
	string,
	{
		Component: React.ComponentType<ComponentProcessProps>;
	}
>;
const directory: Processes = {
	HelloWorld: {
		Component: dynamic(() => import("@/components/apps/hello-world")),
	},
};

export default directory;
