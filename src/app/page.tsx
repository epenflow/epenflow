'use client';
import Arrow from '@/components/Arrow';
import EFLogo from '@/components/EFLogo';
import React from 'react';
import Link from 'next/link';
import { DEFAULT_TEXT } from '@/constants/text';
import tw from 'twin.macro';
import Footer from '@/components/Footer';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { COLOR_PALETTE } from '@/constants/color';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eye from '@/components/Eye';
gsap.registerPlugin(TextPlugin, ScrollTrigger);
export default function Page() {
	const descRef = React.useRef<HTMLParagraphElement>(null);
	const divTwo = React.useRef<HTMLDivElement>(null);
	const con = React.useRef<HTMLDivElement>(null);
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(descRef.current, {
				duration: 10,
				text: '',
				y: 50,
			});
			const divTwoAnimation = gsap.fromTo(
				con.current,
				{
					clipPath: 'inset(25%)',
				},
				{
					clipPath: 'inset(0%)',
				}
			);
			ScrollTrigger.create({
				trigger: con.current,
				pin: true,
				start: 'top top',
				end: 'bottom top',
				scrub: 1,
				animation: divTwoAnimation,
			});
		});
		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<React.Fragment>
			<nav className=' z-20  right-0 uppercase p-1.5 font-extrabold fixed top-0'>
				<Link href={'/works'}>works</Link>
			</nav>
			<main>
				<div className='flex justify-center items-center max-h-screen h-screen flex-col relative overflow-y-hidden overflow-x-hidden'>
					<div
						className='z-10 flex flex-col gap-0.5 sm:gap-2.5 items-center	justify-center p-2'
						data-scroll
						data-scroll-speed='-0.6'>
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
						<Eye />
						<p
							className='xl:text-center italic xl:ml-24 xl:mr-24 ml-2 mr-2 md:ml-10 md:mr-10 md:text-center text-justify'
							ref={descRef}>
							{DEFAULT_TEXT.description}
						</p>
					</div>
					<EFLogo
						size={tw`w-[340px] sm:w-[680px]`}
						color={`${COLOR_PALETTE.neon}`}
						zIndex={-5}
					/>
				</div>
				<div
					className='w-full h-screen bg-black flex items-center justify-center relative'
					ref={con}>
					<video
						src='/theeye.mp4'
						typeof='video/mp4'
						autoPlay
						loop
						muted
						controlsList='nodownload'
						className='min-w-full min-h-full'></video>
				</div>
			</main>

			<Footer />
		</React.Fragment>
	);
}
