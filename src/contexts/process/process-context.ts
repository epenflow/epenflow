"use client";
import React from "react";
import type { ProcessContext, Processes } from "./types";

export default function processContext(): ProcessContext {
	const [processes, setProcesses] = React.useState<Processes>(
		Object.create(null) as Processes
	);
	return {
		processes,
	};
}
