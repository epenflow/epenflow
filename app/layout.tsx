import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/__components__/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'UNDER--Construction',
	description:
		'THIS NEW SITE IS UNDERGOING CONSTRUCTION, PLEASE BE CAREFUL IF THERE IS SUSPICIOUS ACTIVITY',
	icons: {
		icon: '/favicon.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className} suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
