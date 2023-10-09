'use client';
import Link from 'next/link';
import React, { ChangeEvent } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { COLOR_PALETTE } from '@/constants/color';
import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { CloseHover } from '@/components/works/chat/CloseHover';
import Pointer from '@/components/Pointer';
gsap.registerPlugin(TextPlugin);

export default function Page() {
	const [isChange, setChange] = React.useState<string>('');
	const welcomeRef = React.useRef<HTMLHeadingElement>(null);
	const terminalRef = React.useRef<HTMLDivElement>(null);
	const previusRef = React.useRef<HTMLSpanElement>(null);
	const router = useRouter();
	const handleChange = (el: ChangeEvent<HTMLInputElement>) => {
		setChange((prev) => (prev = el.target.value));
	};
	const handleEnter = (el: React.KeyboardEvent<HTMLInputElement>) => {
		if (el.key === 'Enter') {
			router.push(
				`https://api.whatsapp.com/send/?phone=%2B62895330148034&text=${isChange}&type=phone_number&app_absent=0`
			);
		}
	};
	const handleClick = () => {
		router.push(
			`https://api.whatsapp.com/send/?phone=%2B62895330148034&text=${isChange}&type=phone_number&app_absent=0`
		);
	};

	React.useLayoutEffect(() => {
		const tl = gsap.timeline({
			defaults: {
				duration: 5,
			},
		});
		const ctx = gsap.context(() => {
			tl.from(
				terminalRef.current,
				{
					clipPath: 'inset(0% 50% 0% 50%)',
					yPercent: 100,
					scale: 0,
				},
				1
			).from(
				welcomeRef.current,
				{
					text: '',
					duration: 5,
					delay: 4.5,
				},
				2
			);
		});

		return () => {
			ctx.revert();
		};
	}, []);
	return (
		<React.Fragment>
			<Pointer />
			{!isMobile ? <CloseHover previusRef={previusRef} /> : null}
			<main className='flex justify-center items-center h-screen max-h-screen p-4 flex-col gap-3 overflow-y-hidden'>
				<div
					className={`bg-blue-600 w-full h-3/4 md:h-1/2 md:w-1/2 relative rounded-lg border-solid border-2 border-[${COLOR_PALETTE.neon}] box-content overflow-y-hidden`}
					ref={terminalRef}>
					<div
						className={`absolute bg-white top-0 h-7 items-center flex flex-row gap-1  shadow-lg w-full rounded-t-md border-b-2 border-solid border-[${COLOR_PALETTE.neon}]`}>
						<Link href={'/works'}>
							<span
								className='h-3 w-3 block bg-red-500 rounded-full ml-1 hover:animate-pulse'
								ref={previusRef}
							/>
						</Link>
						<span className='h-3 w-3 block bg-yellow-500 rounded-full ml-1' />
						<span className='h-3 w-3 block bg-green-500 rounded-full ml-1' />
					</div>
					<div className='mt-10 m-2 text-white flex flex-col'>
						<h1
							className=''
							ref={welcomeRef}>
							~👾Hi Mate, I think you interested about my work
							maybe you want to send me a text?
							<br />
							send your text in form field below!
							<br />
							Click the red button to navigate to the previous
							page
						</h1>
						<div className='flex flex-col'>
							<div>
								<label className='uppercase font-bold mr-2'>
									epenflow©2023~
								</label>
								<input
									type='text'
									placeholder='Type here...'
									onKeyDown={(el) => handleEnter(el)}
									className={`bg-blue-600 w-1/2 focus:border-none focus:outline-none placeholder-[${COLOR_PALETTE.neon}] placeholder:italic italic animate-pulse`}
									onChange={(el) => handleChange(el)}
								/>
							</div>
							{isChange === '' ? null : (
								<div className=''>
									<p className='italic'>
										hit enter to send message or you can use
										button send message below!
									</p>
									<div className='w-full overflow-x-hidden overflow-y-auto h-[240px]  md:h-[140px] p-2'>
										<p className='w-full h-full'>
											{isChange}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<AnimatePresence>
					{isChange === '' ? null : (
						<motion.button
							initial={{
								clipPath: 'inset(0% 50%)',
							}}
							animate={{
								opacity: 1,
								clipPath: 'inset(0%)',
							}}
							exit={{
								clipPath: 'inset(0% 50%)',
							}}
							transition={{
								type: 'tween',
								duration: 2,
								delay: 0.5,
							}}
							onClick={() => handleClick()}
							className='bg-blue-600 p-2 rounded-md border-solid border-[2px] border-white italic font-bold'>
							<h1>send message</h1>
						</motion.button>
					)}
				</AnimatePresence>
			</main>
			<Footer />
		</React.Fragment>
	);
}
