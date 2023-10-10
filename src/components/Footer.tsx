'use client';
import React from 'react';
import Link from 'next/link';
import { gsap, Power3 } from 'gsap';
const Footer = () => {
	const footerRef = React.useRef<HTMLElement>(null);
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(footerRef.current, {
				yPercent: 100,
				duration: 3.5,
				ease: Power3.easeIn,
			});
		});
		return () => ctx.revert();
	}, []);
	return (
		<footer
			ref={footerRef}
			className='fixed bottom-0 flex justify-center items-center w-screen bg-black p-2 z-[999]'>
			<Link
				href={'mailto:epenflow@gmail.com'}
				className='uppercase font-bold'>
				epenflow©2023
			</Link>
		</footer>
	);
};

export default Footer;
