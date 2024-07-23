export function formatDates(dates: Date) {
	const date = new Intl.DateTimeFormat('en-ID', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
		.format(dates)
		.replaceAll('.', ':');
	return date;
}
