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
import Reveal from '@/components/Reveal';
import { Modal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
gsap.registerPlugin(TextPlugin, ScrollTrigger);
export default function Page() {
	const descRef = React.useRef<HTMLParagraphElement>(null);
	const divTwo = React.useRef<HTMLDivElement>(null);
	const con = React.useRef<HTMLDivElement>(null);
	const router = useRouter();

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
			<Reveal />
			<nav className=' z-20  right-0 uppercase p-1.5 font-extrabold fixed top-0'>
				<Link href={'/works'}>works</Link>
			</nav>

			<main>
				<div className='relative flex flex-col items-center justify-center h-screen max-h-screen overflow-x-hidden overflow-y-hidden'>
					<div
						className='z-10 flex flex-col gap-0.5 sm:gap-2.5 items-center	justify-center p-2'
						data-scroll
						data-scroll-speed='-0.6'>
						<h1 className='text-5xl font-extrabold text-center uppercase sm:text-8xl'>
							{DEFAULT_TEXT.heading}
						</h1>
						<Eye />
						<div className='capitalize flex flex-row flex-wrap gap-1.5'>
							{DEFAULT_TEXT.social.map((socialMedia, index) => (
								<Arrow
									key={index}
									text={socialMedia.name}
									to={socialMedia.link}
								/>
							))}
						</div>
						<Link
							href={
								'https://drive.google.com/drive/folders/1ONDovi1jdQqFAAB4F_UPoW7qsDrepNjU?usp=sharing'
							}
							className='font-medium'>
							Download EpenFlow CV
						</Link>
						<p
							className='ml-2 mr-2 italic text-justify xl:text-center xl:ml-24 xl:mr-24 md:ml-10 md:mr-10 md:text-center'
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
					className='relative flex items-center justify-center w-full h-screen bg-black'
					ref={con}>
					<video
						src='/theeye.mp4'
						typeof='video/mp4'
						autoPlay
						loop
						muted
						controlsList='nodownload'
						className='min-w-full min-h-full'></video>
					<div className='absolute w-full pl-4 pr-4 text-lg text-center text-black -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 xl:pl-24 xl:pr-24 md:pl-14 md:pr-14'>
						<p className={`italic font-medium`}>
							Limitless from the anime Jujutsu Kaisen, which is an
							inherited technique passed down in the Gojo Family.
							This technique brings the concept of “Infinity” into
							reality, allowing the user to manipulate and distort
							space at will
						</p>
						<h1 className='text-3xl font-bold'>"LIMITLESS"</h1>
					</div>
				</div>
			</main>

			<Footer />
		</React.Fragment>
	);
}
