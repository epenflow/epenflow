'use client';
import React from 'react';
import { gsap, Power4 } from 'gsap';
const Reveal = () => {
	const [isState, setState] = React.useState<boolean>(false);
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to('#reveal', {
				height: 0,
				delay: 0.5,
				stagger: {
					amount: 0.5,
				},
				ease: Power4.easeIn,
				onComplete: () => setState((prev) => !prev),
			});
		});
		return () => {
			ctx.revert();
		};
	}, []);
	return isState ? null : (
		<section className='flex flex-row fixed top-0 left-0 z-[999999]'>
			{Array.from({ length: 10 }).map((_, index) => (
				<div
					key={index}
					className='h-screen w-[10vw] bg-blue-600'
					id='reveal'></div>
			))}
		</section>
	);
};

export default Reveal;
