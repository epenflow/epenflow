export function formatDate(dates: Date) {
	const formattedDate = new Intl.DateTimeFormat('en-ID', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	}).format(dates);
	return formattedDate;
}
