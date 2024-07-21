import { Terminal } from '@/app/__components__/terminal';
import { Window } from '@/app/__components__/window';
import { ReorderPositions } from '@/components/programs/reorder-positions';
import { Taskbar } from '@/components/programs/taskbar';

export default function Page() {
	return (
		<main className="h-screen w-screen overflow-hidden">
			<ReorderPositions id={1} label="terminal 1">
				<Terminal label="terminal 1" position={{ x: 100, y: 200 }} />
			</ReorderPositions>
			<ReorderPositions id={2} label="terminal 2">
				<Terminal label="terminal 2" position={{ x: 100, y: 200 }} />
			</ReorderPositions>
			<ReorderPositions label="window 3" id={3}>
				<Window label="window 3" position={{ x: 50, y: 100 }} />
			</ReorderPositions>
			<ReorderPositions label="window 4" id={4}>
				<Window label="window 4" position={{ x: 50, y: 100 }} />
			</ReorderPositions>
			<ReorderPositions label="window 5" id={5}>
				<Window label="window 5" position={{ x: 50, y: 100 }} />
			</ReorderPositions>

			<Taskbar />
		</main>
	);
}
