export const PREFIX_ROUTE = {
	HOME: "/",
	ABOUT: "/about",
	WORK: "/work",
} satisfies Record<string, string>;

export const FILE_CONTENT_NAVIGATION: {
	title: string;
	href: string;
	list: Array<{
		label: string;
		href: string;
	}>;
} = {
	title: "EpenFlow",
	href: PREFIX_ROUTE.HOME,
	list: [
		{
			label: "Home",
			href: PREFIX_ROUTE.HOME,
		},
		{
			label: "About",
			href: PREFIX_ROUTE.ABOUT,
		},
		{
			label: "Work",
			href: PREFIX_ROUTE.WORK,
		},
	],
};
