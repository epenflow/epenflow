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
		{
			name: 'linkedln',
			link: 'https://linkedin.com/in/iputumegakrisnayana',
		},
	],
	description: `"Hi, I'm I Putu Mega Krisnayana ${getAge(
		2000
	)}y/o, but you can call me Epen Flow. I live in Bali, and I'm really enthusiastic about technology and art. I believe that technology should make our lives easier, faster, and more efficient. That's why I decide to pursue a degree in information systems at ITB STIKOM BALI.  Moreover, I'm also self-taught, and whenever I have free time, I spend it studying programming and other topics that I find interesting."`,
};

const DEFAULT_TERMINAL_TEXT = {
	heading_text: `Hey there, I have a feeling you might be interested in my work. Feel free to drop me a message! You can enter your message in the form field below`,
	message_text: `Press Enter to send your message, or you can use the ‘Send Message’ button below!`,
};
export { DEFAULT_TERMINAL_TEXT };
