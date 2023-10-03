/**
 * @jsxImportSource @emotion/react
 */
'use client';
import tw from 'twin.macro';
import Arrow from '@/components/Arrow';
import EFLogo from '@/components/EFLogo';
import React from 'react';
import Link from 'next/link';
type TDefaultText = {
	heading: string;
	social: Array<{
		name: string;
		link: string;
	}>;
	description: string;
};
const DEFAULT_TEXT: TDefaultText = {
	heading: 'epen flow',
	social: [
		{
			link: 'https://www.instagram.com/epenflow/',
			name: 'instagram',
		},
		{
			name: 'facebook',
			link: 'https://web.facebook.com/epenflow',
		},
	],
	description: `I'm Epen Flow visual artist who translate inspirations into viusal narative.`,
};

export default function Page() {
	return (
		<React.Fragment>
			<main tw='flex justify-center items-center max-h-screen h-screen flex-col relative overflow-y-hidden overflow-x-hidden'>
				<div tw='z-10 flex flex-col gap-0.5 sm:gap-2.5 items-center	justify-center p-2 bg-black'>
					<h1 tw='text-5xl sm:text-8xl uppercase font-medium text-center'>
						{DEFAULT_TEXT.heading}
					</h1>
					<div tw='capitalize flex flex-row flex-wrap gap-1.5'>
						{DEFAULT_TEXT.social.map((socialMedia, index) => (
							<Arrow
								key={index}
								text={socialMedia.name}
								to={socialMedia.link}
							/>
						))}
					</div>
					<p tw='text-center italic'>{DEFAULT_TEXT.description}</p>
				</div>
				<EFLogo
					size={tw`w-[340px] sm:w-[680px]`}
					color='#39FF14'
					zIndex={-5}
				/>
			</main>
			<footer tw='fixed bottom-0 flex justify-center items-center w-screen'>
				<Link
					href={'mailto:epenflow@gmail.com'}
					tw='uppercase font-medium'>
					epenflow©2023
				</Link>
			</footer>
		</React.Fragment>
	);
}
