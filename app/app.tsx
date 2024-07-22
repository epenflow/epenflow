'use server';
import { DearVisitor } from '@/app/__components__/dear-visitor';
import Navbar from '@/app/__components__/navbar';
import { Notes } from '@/app/__components__/notes';
import { Caution } from '@/components/caution';
import { ReorderPositions } from '@/components/programs/reorder-positions';
import { Taskbar } from '@/components/programs/taskbar';
import Image from 'next/image';
import React from 'react';

export default async function App() {
	return (
		<React.Fragment>
			<Navbar />
			<main className="relative w-screen overflow-x-hidden">
				<ReorderPositions id={1} label="dear-visitor">
					<DearVisitor />
				</ReorderPositions>
				<ReorderPositions id={2} label="notes">
					<Notes />
				</ReorderPositions>
				<div
					className="flex h-screen w-screen items-center justify-center bg-cover bg-no-repeat"
					style={{
						backgroundImage: `url('/windows--xp.webp')`,
					}}
				>
					<Caution />
				</div>
				<div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
					<Image
						src="/palu.gif"
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: '100%', height: 'auto' }}
						alt="palu"
						priority={false}
						quality={50}
					/>
				</div>
			</main>
			<Taskbar />
		</React.Fragment>
	);
}
