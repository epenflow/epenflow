import Footer from '@/components/Footer';
import { RECENT_WORKS } from '@/constants/works';
import Link from 'next/link';
import React from 'react';
// import { ImArrowUp } from 'react-icons/im';

export default async function Works() {
	return (
		<React.Fragment>
			<main className='relative overflow-y-hidden flex flex-col flex-wrap justify-center gap-2 p-4 box-border mb-14'>
				<div className=''>
					<Link
						href={'/'}
						className='text-xl uppercase font-bold'>
						back
					</Link>
				</div>
				<div>
					<h1 className='text-3xl sm:text-6xl md:text-9xl uppercase font-bold'>
						this featured some recent works
					</h1>
				</div>
				<div className='flex flex-row flex-wrap gap-2 justify-center'>
					{RECENT_WORKS.map((items, index) => (
						<div
							key={index}
							className='p-2 w-[320px] bg-white flex justify-center flex-col text-black neon-border gap-2'>
							<React.Suspense fallback={<h1>loading...</h1>}>
								<div className='h-[290px] w-[300px] neon-border overflow-hidden hover:cursor-pointer'>
									<img
										src={items.images.src}
										className='h-[290px] w-[300px] object-contain transition duration-300 ease-in-out hover:scale-125'
										alt={items.title}
									/>
								</div>
							</React.Suspense>
							<h1 className='font-bold line-clamp-2 capitalize'>
								{items.title}
							</h1>
							<table>
								<tbody className='text-left capitalize font-bold text-xs first-letter'>
									<tr>
										<th>category</th>
										<td>{items.category}</td>
									</tr>
									<tr>
										<th>client</th>
										<td>{items.client}</td>
									</tr>
									<tr>
										<th>year</th>
										<td>{items.year}</td>
									</tr>
								</tbody>
							</table>
						</div>
					))}
				</div>
				{/* <div className='bg-white p-5 rounded-full sticky top-1/2 right-5 z-20 neon-border'>
					<ImArrowUp color='#39ff14' />
				</div> */}
			</main>
			<Footer />
		</React.Fragment>
	);
}
