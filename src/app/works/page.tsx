import Footer from '@/components/Footer';
import ListWorks from '@/components/works/ListWorks';
import { RECENT_WORKS } from '@/constants/works';
import Link from 'next/link';
import React from 'react';
import Cakra from '@/components/Cakra';
import WorkHeader from '@/components/works/WorkHeader';
import Eye from '@/components/Eye';

// import { ImArrowUp } from 'react-icons/im';

export default async function Works() {
	return (
		<React.Fragment>
			<nav className='z-50 flex flex-row w-full justify-between fixed top-0 left-0 bg-black items-center p-2'>
				<div>
					<Link
						href={'/'}
						className='text-xl uppercase font-bold'>
						back,
					</Link>
					<Link
						href={'/works/chat'}
						className='italic capitalize'>
						&nbsp; let's chat
					</Link>
				</div>
			</nav>
			<main className='relative overflow-y-hidden flex flex-col flex-wrap justify-center gap-2 p-4 box-border mb-14 mt-12 md:mt-10'>
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
			</main>
			<Footer />
		</React.Fragment>
	);
}
