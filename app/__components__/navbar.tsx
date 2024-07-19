'use client';

import { useGetCurrentTime } from '@/lib/hooks/get-time';
import dynamic from 'next/dynamic';

const Navbar = () => {
	const dates = useGetCurrentTime();
	return (
		<header className="menu-bar fixed top-0 z-50 flex w-screen items-center overflow-hidden px-10 py-1 font-medium text-white">
			<nav className="flex w-full items-center justify-between">
				<h1>File</h1>
				<div className="">{dates}</div>
			</nav>
		</header>
	);
};
export default dynamic(() => Promise.resolve(Navbar), {
	ssr: false,
});
