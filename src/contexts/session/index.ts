"use client";
import contextFactory from "@/contexts/context-factory";
import sessionContext from "./session-context";

export const { Provider: SessionProvider, useContext: useSession } =
	contextFactory(sessionContext);
