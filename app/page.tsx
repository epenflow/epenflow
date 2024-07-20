'use server';
import { DearVisitor } from '@/app/__components__/dear-visitor';
import Navbar from '@/app/__components__/navbar';
import { Notes } from '@/app/__components__/notes';
import { Project } from '@/app/__components__/project';
import { Caution } from '@/components/caution';
import db from '@/lib/db';
import Image from 'next/image';
import React from 'react';

export default async function Home() {
	const projects = await db.project.findMany();
	const files = await db.files.findMany();

	return (
		<React.Fragment>
			<Navbar />
			<main className="relative w-screen overflow-x-hidden">
				<DearVisitor />
				<Notes />
				<Project projects={projects} files={files} />
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
			<div
				id="terminal-portal"
				className="fixed bottom-8 right-2 z-20 flex h-full flex-col-reverse items-center gap-1 lg:bottom-10 lg:right-5"
			></div>
		</React.Fragment>
	);
}
