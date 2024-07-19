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
				<Navbar />
				{children}
				<div
					id="terminal-portal"
					className="fixed bottom-8 right-2 z-20 flex h-full flex-col-reverse items-center gap-1 lg:bottom-10 lg:right-5"
				></div>
			</body>
		</html>
	);
}
