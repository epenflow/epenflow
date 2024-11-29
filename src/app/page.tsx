import { Note, Profile } from "@/components/base";
import { DesktopLayout } from "@/components/layouts";

export default function Home() {
	return (
		<DesktopLayout>
			<Note />
			<Profile />
		</DesktopLayout>
	);
}
