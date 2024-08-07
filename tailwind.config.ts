import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				terminal: {
					100: '#ffff',
					200: '#f2f2f2',
					300: '#f5f5f5',
					400: '#D0D0D0',
					//blue
					500: '#007AFF',
					600: '#c9e3ff',
				},
				window: {
					'header-accent': 'rgba(var(--window-header-accent,1))',
					'header-secondary': 'rgba(var--window-header-secondary,1)',
				},
			},
			backgroundImage: {
				'window-header-gradient':
					'linear-gradient(90deg, rgba(var(--window-header-accent), 1) 0%, rgba(var(--window-header-secondary), 1) 100%)',
				'terminal-header-gradient':
					'linear-gradient(180deg,#e7e6e7,#d1d0d1)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
		boxShadow: {
			'terminal-box-shadow':
				'0 0 1px 0 rgba(0, 0, 0, .9), 0 20px 30px 0 rgb(0 0 0 / 0%), 0 10px 50px 0 rgb(0 0 0 / 0%)',
		},
	},

	plugins: [
		require('tailwindcss-animate'),
		({ addUtilities }: { addUtilities: any }) => {
			addUtilities({
				'.border-terminal-default': {
					border: '1px solid #d0d0d0;',
				},
				'.shadow-terminal-100': {
					boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
				},
				'.shadow-terminal-200': {
					boxShadow:
						'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
				},
				'.window-border': {
					border: '4px ridge #d8d8d8',
				},
			});
		},
	],
} satisfies Config;

export default config;
