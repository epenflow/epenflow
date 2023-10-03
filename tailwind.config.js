/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			animation: {
				'slow-spin': 'newspin 2s linear infinite',
			},
			keyframes: {
				newspin: {
					from: { transform: 'rotate(360deg)' },
					to: {
						transform: 'rotate(0deg)',
					},
				},
			},
		},
	},
	plugins: [],
};
