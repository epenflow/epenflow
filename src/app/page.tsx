import { Note, Profile } from "@/components/base";

export default function Home() {
	return (
		<main id="desktop-container" className="h-[calc(100svh-1.5rem)]">
			<Profile />
			<Note />
		</main>
	);
}
