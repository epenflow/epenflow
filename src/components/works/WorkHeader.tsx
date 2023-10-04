'use client';
import React from 'react';
import gsap from 'gsap';
const WorkHeader = () => {
	const headerRef = React.useRef<HTMLHeadingElement>(null);
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(headerRef.current, {
				yPercent: -100,
				duration: 5,
				stagger: {
					amount: 1,
					each: 0.5,
				},
			});
		});
		return () => {
			ctx.revert();
		};
	}, []);
	return (
		<h1
			className='text-3xl sm:text-6xl md:text-9xl uppercase font-bold'
			ref={headerRef}>
			this featured some recent works
		</h1>
	);
};

export default WorkHeader;
