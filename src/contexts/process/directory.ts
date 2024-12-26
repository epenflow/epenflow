import dynamic from "next/dynamic";
import type { Processes } from "./types";

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
