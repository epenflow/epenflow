import { RECENT_WORKS } from '@/constants/works';

export default function Page() {
	return (
		<main>
			{RECENT_WORKS.map(({ title }, index) => (
				<div key={index}>
					<h1>{title}</h1>
				</div>
			))}
		</main>
	);
}
