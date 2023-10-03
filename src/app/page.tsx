import Arrow from '@/components/Arrow';
import EFLogo from '@/components/EFLogo';
import React from 'react';
import Link from 'next/link';
import { DEFAULT_TEXT } from '@/constants/text';
import tw from 'twin.macro';
import Footer from '@/components/Footer';
export default function Page() {
	return (
		<React.Fragment>
			<main className='flex justify-center items-center max-h-screen h-screen flex-col relative overflow-y-hidden overflow-x-hidden'>
				<div className='z-10 flex flex-col gap-0.5 sm:gap-2.5 items-center	justify-center p-2 bg-black'>
					<h1 className='text-5xl sm:text-8xl uppercase font-extrabold text-center'>
						{DEFAULT_TEXT.heading}
					</h1>
					<div className='capitalize flex flex-row flex-wrap gap-1.5'>
						{DEFAULT_TEXT.social.map((socialMedia, index) => (
							<Arrow
								key={index}
								text={socialMedia.name}
								to={socialMedia.link}
							/>
						))}
					</div>
					<p className='text-center italic'>
						{DEFAULT_TEXT.description}
					</p>
				</div>
				<EFLogo
					size={tw`w-[340px] sm:w-[680px]`}
					color='#39FF14'
					zIndex={-5}
				/>
				<div className='absolute z-20 top-0 right-0 uppercase p-1.5 font-extrabold'>
					<Link href={'/works'}>works</Link>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
}
