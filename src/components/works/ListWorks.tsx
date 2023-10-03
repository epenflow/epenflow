'use client';
import { TRecentWorks } from '@/constants/works';
import React from 'react';
import { ImArrowDownRight2, ImArrowRight2 } from 'react-icons/im';
import tw from 'twin.macro';
import CardWorks from './CardWorks';
const ListWorks = ({ category, client, images, title, year }: TRecentWorks) => {
	const [isOver, setOver] = React.useState<boolean>(false);
	const [isClick, setClick] = React.useState<boolean>(false);
	return (
		<div
			className='flex flex-col cursor-pointer relative'
			onMouseEnter={() => setOver((prev) => (prev = true))}
			onMouseLeave={() => setOver((prev) => (prev = false))}
			onClick={() => setClick((prev) => !prev)}>
			<div className='flex flex-row justify-between items-center'>
				<h1 className='uppercase line-clamp-2 md:text-6xl sm:text-3xl'>
					{title}
				</h1>

				{isOver ? (
					<ImArrowRight2 className='text-1xl md:text-4xl sm:text-3xl' />
				) : (
					<ImArrowDownRight2 className='text-1xl md:text-4xl sm:text-3xl' />
				)}
			</div>
			{isOver ? (
				<div className='absolute md:block hidden  -top-[185px] right-10 z-20 bg-white neon-border'>
					<img
						src={images.src}
						alt=''
						className='h-60 w-60 object-contain'
					/>
				</div>
			) : null}
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
