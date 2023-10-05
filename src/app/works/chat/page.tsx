'use client';
import Link from 'next/link';
import React, { ChangeEvent } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Cakra from '@/components/Cakra';
import Image from 'next/image';
import epen from '/public/epen.png';
import { COLOR_PALETTE } from '@/constants/color';
gsap.registerPlugin(TextPlugin);
type TWhereMouse = {
	x: number;
	y: number;
};
export default function Page() {
	const [isChange, setChange] = React.useState<string>('');
	const welcomeRef = React.useRef<HTMLHeadingElement>(null);
	const terminalRef = React.useRef<HTMLDivElement>(null);
	const [whereMouse, setWhereMoues] = React.useState<TWhereMouse>({
		x: 0,
		y: 0,
	});
	const previusRef = React.useRef<HTMLSpanElement>(null);
	const hoverRef = React.useRef<HTMLDivElement>(null);
	const router = useRouter();
	const handleChange = (el: ChangeEvent<HTMLInputElement>) => {
		setChange((prev) => (prev = el.target.value));
	};
	const handleEnter = (el: React.KeyboardEvent<HTMLInputElement>) => {
		if (el.key === 'Enter') {
			console.info('hit enter');
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
	const handleMouseMove = (event: MouseEvent) => {
		setWhereMoues((prev) => ({
			...prev,
			x: event.clientX,
			y: event.clientY,
		}));
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
		previusRef.current?.addEventListener('mouseenter', () => {
			hoverAnimations.play();
		});
		previusRef.current?.addEventListener('mouseleave', () => {
			hoverAnimations.reverse();
		});
		return () => {
			ctx.revert();
		};
	}, []);
	React.useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);
	return (
		<React.Fragment>
			<main className='flex justify-center items-center h-screen max-h-screen p-4 flex-col gap-3 overflow-y-hidden'>
				<div
					className='bg-blue-600 h-52 w-52 z-50 hidden md:flex sm:flex fixed neon-border justify-center '
					style={{ left: whereMouse.x + 5, top: whereMouse.y + 20 }}
					ref={hoverRef}>
					<Image
						src={epen.src}
						width={208}
						height={208}
						alt='epen flow'
						style={{ objectFit: 'contain' }}
					/>
				</div>

				<div
					className={`fixed h-5 w-5  bg-white rounded-full z-50 outline-2 outline-[${COLOR_PALETTE.neon}] flex justify-center items-center neon-border`}
					style={{
						left: whereMouse.x,
						top: whereMouse.y + 10,
					}}>
					<div className='bg-blue-600 neon-border  rounded-full h-3 w-3'></div>
				</div>

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
				{isChange === '' ? null : (
					<button
						onClick={() => handleClick()}
						className='bg-blue-600 p-2 rounded-md neon-border'>
						<h1>send message</h1>
					</button>
				)}
			</main>
			<Footer />
		</React.Fragment>
	);
}
