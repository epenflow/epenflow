'use client';
import Link from 'next/link';
import React, { ChangeEvent } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useRouter } from 'next/navigation';
gsap.registerPlugin(TextPlugin);
export default function Page() {
	const [isChange, setChange] = React.useState<string>('');
	const welcomeRef = React.useRef<HTMLHeadingElement>(null);
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
	React.useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(welcomeRef.current, {
				text: '',
				duration: 5,
			});
		});
		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<main className='flex justify-center items-center h-screen max-h-screen p-4 flex-col gap-3'>
			<div className='bg-blue-600 w-full h-3/4 md:h-1/2 md:w-1/2 relative rounded-lg border-solid border-2 border-[#39FF14] box-content overflow-y-auto'>
				<div className='absolute bg-white top-0 h-7 items-center flex flex-row gap-1  shadow-lg w-full rounded-t-md border-b-2 border-solid border-[#39FF14]'>
					<Link href={'/works'}>
						<span className='h-3 w-3 block bg-red-500 rounded-full ml-1' />
					</Link>
					<span className='h-3 w-3 block bg-yellow-500 rounded-full ml-1' />
					<span className='h-3 w-3 block bg-green-500 rounded-full ml-1' />
				</div>
				<div className='mt-10 m-2 text-white flex flex-col'>
					<h1
						className=''
						ref={welcomeRef}>
						~👾Hi mate i think you intrested about my work maybe you
						want to send me text?
						<br />
						send your text in form field below!
					</h1>
					<div className='flex flex-col'>
						{isChange === '' ? null : (
							<React.Fragment>
								<div className='w-full overflow-x-hidden overflow-y-auto h-[140px] p-2'>
									<p className='w-full h-full'>{isChange}</p>
								</div>
								<p className='italic'>
									hit enter to send message!
								</p>
							</React.Fragment>
						)}
						<div>
							<label className='uppercase font-bold mr-2'>
								epenflow©2023~
							</label>
							<input
								type='text'
								placeholder='Type here'
								onKeyDown={(el) => handleEnter(el)}
								className='bg-blue-600 w-1/2 focus:border-none focus:outline-none'
								onChange={(el) => handleChange(el)}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
