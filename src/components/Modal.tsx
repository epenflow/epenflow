'use client';
import gsap, { Power4 } from 'gsap';
import React from 'react';
import TextPlugin from 'gsap/TextPlugin';
import Link from 'next/link';
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
	const [isActived, setActived] = React.useState<boolean>(true);
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
	function handleClick() {
		setActived((prev) => !prev);
	}
	return isActived ? (
		<article
			className='w-4/5 h-4/5
lg:h-4/5 lg:w-1/2 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex-col z-[9999999999999] bg-[#f2f2f2] text-black rounded-md border border-solid border-[#e0e0e0] shadow-md overflow-hidden'>
			<div className='p-1 bg-[#f5f5f5] h-8 flex items-center rounded-t-md border border-solid border-b-[#e0e0e0] shadow-sm justify-center relative z-30'>
				<div className='absolute left-0 flex flex-row gap-1'>
					<span
						onClick={handleClick}
						className='block w-3 h-3 ml-1 bg-red-500 rounded-full hover:cursor-pointer hover:animate-pulse'
					/>
					<span
						onClick={handleClick}
						className='block w-3 h-3 ml-1 bg-yellow-500 rounded-full hover:cursor-pointer'
					/>
					<span
						onClick={handleClick}
						className='block w-3 h-3 ml-1 bg-green-500 rounded-full hover:cursor-pointer'
					/>
				</div>
				<h1 className='text-xs font-bold'>
					epenflow<span className='italic'>@</span>2022
				</h1>
			</div>
			<div className='relative h-full px-2 text-white'>
				<h1 className='relative z-20 font-semibold text-white mix-blend-difference'>
					"This site is currently undergoing maintenance,
					<br />
					We'll be back soon with a fresh design, content, etc. Stay
					tuned!"
					<br />
					<span className=''>
						---Epen FLow,{' '}
						<Link
							href={'https://ef-studio.vercel.app/'}
							className='capitalize hover:underline hover:italic'>
							our new site &#x2192;
						</Link>
					</span>
				</h1>

				<div className='absolute top-0 left-0 flex w-full h-full bg-black'>
					{colorCode.map((item, index) => (
						<div
							className={`w-full h-full block`}
							id='color__items'
							style={{ backgroundColor: item }}
							key={index}></div>
					))}
					<div className='absolute p-2 -translate-x-1/2 -translate-y-1/2 bg-black top-1/2 left-1/2'>
						<h1
							className='font-mono font-bold text-justify text-white uppercase text-1xl lg:text-6xl'
							id='no-signal'>
							oops no signal!
						</h1>
					</div>
				</div>
			</div>
		</article>
	) : null;
};
