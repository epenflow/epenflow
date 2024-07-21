'use client';

import { useCurrentTime } from '@/lib/hooks/use-current-time';
import dynamic from 'next/dynamic';

const Navbar = () => {
	const dates = useCurrentTime();
	return (
		<header className="menu-bar fixed top-0 z-20 flex w-screen items-center overflow-hidden px-10 py-1 font-medium text-white">
			<nav className="flex w-full items-center justify-between">
				<div>File</div>
				<div className="">{dates}</div>
			</nav>
		</header>
	);
};
export default dynamic(() => Promise.resolve(Navbar), {
	ssr: false,
});
