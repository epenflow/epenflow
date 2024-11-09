"use client";

import { format } from "date-fns";
import React from "react";

export function useTime(ms: number, formatter?: string): string {
	const [date, setDate] = React.useState<Date>(new Date());

	function updateDate() {
		setDate((prev) => {
			const date = new Date();
			prev = date;
			return date;
		});
	}

	React.useEffect(() => {
		const interval = setInterval(updateDate, ms);

		return () => {
			clearInterval(interval);
		};
	}, [ms]);

	return formatter ? format(date, formatter) : date.toISOString();
}
