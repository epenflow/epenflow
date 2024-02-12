'use client';
import gsap, { Power4 } from 'gsap';
import React from 'react';
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
const colorCode = [
	'#FFFFFF',
	'#F8FB02',
	'#02FEFF',
	'#01FF00',
	'#FD00FB',
	'#FB0102',
	'#0301FC',
];
export const Modal = () => {
	React.useLayoutEffect(() => {
		const tl = gsap.timeline({
			repeat: -1,
		});
		const colorItems = gsap.utils.toArray('#color__items');
		const nosignal = document.querySelector('#no-signal');

		const ctx = gsap.context(() => {
			tl
				.fromTo(
					colorItems,
					{
						height: 0,
						width: 0,
						repeat: -1,
					},
					{
						height: '100%',
						width: '100%',
						stagger: 0.5,
						repeat: -1,
						ease: Power4.easeInOut,
						duration: 1.5,
						yoyo: true,
					},
					'-=0.5'
				)
				.fromTo(
					nosignal,
					{
						text: '',
					},
					{ text: 'oops no signal!' }
				),
				'-=1';
		});

		return () => ctx.revert();
	}, []);
	return (
		<article
			className='w-4/5 h-4/5
lg:h-4/5 lg:w-1/2 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex-col z-[9999999999999] bg-[#f2f2f2] text-black rounded-md border border-solid border-[#e0e0e0] shadow-md overflow-hidden'>
			<div className='p-1 bg-[#f5f5f5] h-8 flex items-center rounded-t-md border border-solid border-b-[#e0e0e0] shadow-sm justify-center relative z-30'>
				<div className='flex flex-row gap-1 absolute left-0'>
					<span className='h-3 w-3 block bg-red-500 rounded-full ml-1 hover:animate-pulse' />
					<span className='h-3 w-3 block bg-yellow-500 rounded-full ml-1' />
					<span className='h-3 w-3 block bg-green-500 rounded-full ml-1' />
				</div>
				<h1 className='font-bold text-xs'>
					epenflow<span className='italic'>@</span>2022
				</h1>
			</div>
			<div className='px-2 relative h-full text-white'>
				<h1 className='font-semibold z-20 relative text-white mix-blend-difference'>
					"This site is currently undergoing maintenance,
					<br />
					We'll be back soon with a fresh design, content, etc. Stay
					tuned!"
					<br />
					<span className=''>---Epen FLow</span>
				</h1>
				<div className='absolute top-0 left-0 bg-black w-full h-full flex'>
					{colorCode.map((item, index) => (
						<div
							className={`w-full h-full block`}
							id='color__items'
							style={{ backgroundColor: item }}
							key={index}></div>
					))}
					<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black p-2'>
						<h1
							className='text-white text-1xl lg:text-6xl font-mono font-bold uppercase text-justify'
							id='no-signal'>
							oops no signal!
						</h1>
					</div>
				</div>
			</div>
		</article>
	);
};
