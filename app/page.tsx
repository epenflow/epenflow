import { DearVisitor } from '@/app/__components__/dear-visitor';
import { Notes } from '@/app/__components__/notes';
import { __TestWindow } from '@/app/__unit-testing__/__test-window';
export default function Home() {
	return (
		<main className="relative h-screen w-screen overflow-hidden p-4">
			<__TestWindow />
			{/* <DearVisitor /> */}
			<Notes />
		</main>
	);
}
