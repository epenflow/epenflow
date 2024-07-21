import { Terminal } from '@/app/__components__/terminal';
import { Window } from '@/app/__components__/window';
import { ReorderPositions } from '@/components/programs/reorder-positions';
import { Taskbar } from '@/components/programs/taskbar';

export default function Page() {
	return (
		<main className="h-screen w-screen overflow-hidden">
			<Terminal label="terminal" position={{ x: 100, y: 200 }} />
			<Window label="window" position={{ x: 50, y: 100 }} />
			<Taskbar />
		</main>
	);
}
