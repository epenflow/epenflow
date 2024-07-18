import { __visitors } from '@/app/__components__/__constants__';
import { Terminal } from '@/app/__components__/terminal';

export const DearVisitor = () => {
	return (
		<Terminal title={__visitors.header}>
			<h1 className="text-2xl font-bold">Dear visitor,</h1>
			<p className="text-justify font-bold">{__visitors.descriptions}</p>
			{/* <video
				autoPlay
				muted
				loop
				className="flex h-full w-full items-center justify-center"
			>
				<source
					src="/bangliskatepark.mp4"
					className="h-full w-full"
				></source>
			</video> */}
			<h1 className="flex w-full flex-col text-end text-2xl font-bold">
				<span>Warms regret,</span>
				<span>EpenFlow@24</span>
			</h1>
		</Terminal>
	);
};
