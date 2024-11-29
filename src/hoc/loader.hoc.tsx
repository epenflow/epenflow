"use client";
import React from "react";

export function Loader<T extends object>(
	BaseComponent: React.ComponentType<T>,
) {
	function Component(props: T) {
		return <BaseComponent {...props} />;
	}

	return Component;
}
