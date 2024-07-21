'use client';
import React from 'react';

export function useCurrentTime() {
	const [dates, setDates] = React.useState<Date>(new Date());
	React.useEffect(() => {
		const interval = setInterval(() => {
			setDates((prev) => {
				const newDates = new Date();
				prev = newDates;
				return prev;
			});
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);
	function formatDate(date: Date | number) {
		const dateFormat = new Intl.DateTimeFormat('en-ID', {
			weekday: 'short',
			day: '2-digit',
			month: 'long',
			minute: '2-digit',
			hour: '2-digit',
			second: '2-digit',
		}).format(date);
		return dateFormat;
	}
	return formatDate(dates).replaceAll('.', ' : ').replace('at', '');
}
