import { getAge } from '@/utils/getYear';

type TDefaultText = {
	heading: string;
	social: Array<{
		name: string;
		link: string;
	}>;
	description: string;
};

export const DEFAULT_TEXT: TDefaultText = {
	heading: 'epen flow',
	social: [
		{
			link: 'https://www.instagram.com/epenflow/',
			name: 'instagram',
		},
		{
			name: 'facebook',
			link: 'https://web.facebook.com/epenflow',
		},
	],
	description: `Hi I'm Epen Flow ${getAge(
		2000
	)} years old, I'm visual artist who translate my inspirations into visual narative.`,
};
