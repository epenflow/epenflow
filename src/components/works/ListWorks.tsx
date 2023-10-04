'use client';
import { TRecentWorks } from '@/constants/works';
import React from 'react';
import { ImArrowDownRight2, ImArrowRight2 } from 'react-icons/im';
import tw from 'twin.macro';
import CardWorks from './CardWorks';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Image from 'next/image';
gsap.registerPlugin(TextPlugin);
const ListWorks = ({ category, client, images, title, year }: TRecentWorks) => {
	const [isOver, setOver] = React.useState<boolean>(false);
	const [isClick, setClick] = React.useState<boolean>(false);
	const titleRef = React.useRef<HTMLHeadingElement>(null);
	const hoverRef = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				duration: 5,
				text: '',
				xPercent: -100,
				yPercent: -200,
			});
		});
		const hoverAnimations = gsap.fromTo(
			hoverRef.current,
			{
				opacity: 0,
				scale: 0,
				yPercent: -100,
				stagger: {
					amount: 1,
					each: 1,
				},
				visibility: 'none',
			},
			{
				opacity: 1,
				paused: true,
				scale: 1,
				yPercent: 0,
				visibility: 'block',
			}
		);
		titleRef.current?.addEventListener('mouseenter', () => {
			hoverAnimations.play();
			setOver((prev) => (prev = true));
		});
		titleRef.current?.addEventListener('mouseleave', () => {
			hoverAnimations.reverse();
			setOver((prev) => (prev = false));
		});
		return () => {
			ctx.revert();
			titleRef.current?.removeEventListener('mouseenter', () => {
				hoverAnimations.kill();
				setOver((prev) => (prev = false));
			});
		};
	}, []);
	return (
		<div className='flex flex-col cursor-pointer relative'>
			<div className='flex flex-row justify-between items-center'>
				<button onClick={() => setClick((prev) => !prev)}>
					<h1
						className='uppercase line-clamp-2 md:text-6xl sm:text-3xl sm:text-left md:text-left'
						ref={titleRef}>
						{title}
					</h1>
				</button>

				{isOver ? (
					<ImArrowRight2 className='text-1xl md:text-4xl sm:text-3xl' />
				) : (
					<ImArrowDownRight2 className='text-1xl md:text-4xl sm:text-3xl' />
				)}
			</div>

			<div
				className='absolute md:block hidden  -top-[185px] right-10 z-20 bg-white neon-border'
				ref={hoverRef}>
				<Image
					src={images.src}
					height={240}
					width={240}
					alt={title}
					style={{ objectFit: 'contain' }}
				/>
			</div>

			<span className='w-full h-0.5 bg-white block' />
			{isClick ? (
				<div className='flex justify-center mt-2 md:justify-center'>
					<CardWorks
						category={category}
						client={client}
						images={images}
						title={title}
						year={year}
					/>
				</div>
			) : null}
		</div>
	);
};

export default ListWorks;
