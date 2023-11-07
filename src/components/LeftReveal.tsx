'use client';
import React from 'react';
import { gsap, Power4 } from 'gsap';

const LeftReveal = () => {
	const [isState, setState] = React.useState<boolean>(true);
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to('#reveal', {
				width: 0,
				delay: 0.5,
				stagger: {
					amount: 0.5,
				},
				ease: Power4.easeInOut,
				onComplete: () => setState((prev) => (prev = false)),
			});
		});
		return () => ctx.revert();
	}, []);
	return isState ? (
		<section className='fixed left-0 top-0 z-[9999999]'>
			{Array.from({ length: 10 }).map((_, index) => (
				<div
					key={index}
					className='bg-blue-600 h-[10vh] w-[100vw]'
					id='reveal'></div>
			))}
		</section>
	) : null;
};

export default LeftReveal;
