import { Note, About } from "@/components/base";

export default function Home() {
	return (
		<main className="h-[calc(100svh-1.5rem)]">
			<About />
			<Note />
		</main>
	);
}
