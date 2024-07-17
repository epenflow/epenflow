import { TestTerminal } from '@/app/__components__/test-terminal';

export default function Home() {
	return (
		<main className="relative h-screen w-screen overflow-hidden p-4">
			<TestTerminal />
			<TestTerminal />
		</main>
	);
}
