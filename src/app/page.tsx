"use client";

import { useProcess } from "@/contexts/process";

export default function Home() {
	const { processes = {} } = useProcess();
	return (
		<main>
			{Object.entries(processes).map(([id, { Component }]) => (
				<Component id={id} key={id} />
			))}
		</main>
	);
}
