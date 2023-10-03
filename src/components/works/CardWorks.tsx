import { TRecentWorks } from '@/constants/works';
import React from 'react';

const CardWorks = ({ images, category, client, title, year }: TRecentWorks) => {
	return (
		<div className='p-2 w-[320px] md:w-1/2 bg-white flex flex-col justify-center text-black neon-border gap-2'>
			<div className='h-[290px] w-[300px] md:w-full flex justify-center neon-border overflow-hidden hover:cursor-pointer'>
				<img
					src={images.src}
					className='h-[290px] w-[300px] object-contain transition duration-300 ease-in-out hover:scale-125'
					alt={title}
					placeholder='blur'
				/>
			</div>
			<h1 className='font-bold line-clamp-2 capitalize'>{title}</h1>
			<table>
				<tbody className='text-left capitalize font-bold text-xs first-letter'>
					<tr>
						<th>category</th>
						<td>{category}</td>
					</tr>
					<tr>
						<th>client</th>
						<td>{client}</td>
					</tr>
					<tr>
						<th>year</th>
						<td>{year}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default CardWorks;
