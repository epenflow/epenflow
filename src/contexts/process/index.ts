"use client";
import contextFactory from "@/contexts/context-factory";
import processContext from "./process-context";

export const { Provider: ProcessProvider, useContext: useProcess } =
	contextFactory(processContext);
