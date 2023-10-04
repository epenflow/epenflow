import Footer from '@/components/Footer';
import ListWorks from '@/components/works/ListWorks';
import { RECENT_WORKS } from '@/constants/works';
import Link from 'next/link';
import React from 'react';
import Cakra from '@/components/Cakra';
import WorkHeader from '@/components/works/WorkHeader';

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
				<div className='relative'>
					<WorkHeader />
					<Cakra />
				</div>
				{RECENT_WORKS.map((items, index) => (
					<ListWorks
						key={index}
						{...items}
					/>
				))}
				{/* <div className='bg-white p-5 rounded-full sticky top-1/2 right-5 z-20 neon-border'>
					<ImArrowUp color='#39ff14' />
				</div> */}
			</main>
			<Footer />
		</React.Fragment>
	);
}
