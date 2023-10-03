export function getAge(year: number): number {
	const getYearNow = new Date();
	return getYearNow.getFullYear() - year;
}
