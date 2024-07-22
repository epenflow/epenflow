export function formatDates(dates: Date) {
	const date = new Intl.DateTimeFormat('en-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(dates);
	return date;
}
