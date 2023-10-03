'use client';
/**
 * @jsxImportSource @emotion/react
 */
import tw from 'twin.macro';
import React from 'react';
import { IData } from '@/app/works/page';

const Card = ({ products }: IData) => {
	return (
		<div tw='flex flex-row flex-wrap justify-center gap-1 mt-1.5'>
			{products.map((items, index) => (
				<div
					key={index}
					tw='bg-white h-[300px] w-[320px] text-black '>
					<img
						src={items.thumbanil}
						alt=''
						tw='h-[300px] w-[320px] object-center'
					/>
					<h1 tw='font-black capitalize text-xl'>testing</h1>
				</div>
			))}
		</div>
	);
};

export default Card;
