import { Terminal } from "@/components/base/terminal/terminal";

export default function Home() {
	return (
		<main className="container flex h-screen items-center justify-center">
			<Terminal
				index={1}
				classNameModal="fixed"
				position={{ x: 10, y: 100 }}
				label={"fuck"}>
				<p>test</p>
			</Terminal>
			<Terminal classNameModal="fixed" index={2}>
				<span>Fuck</span>
			</Terminal>
		</main>
	);
}
