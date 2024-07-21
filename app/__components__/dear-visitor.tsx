import { __visitors } from '@/app/__components__/__constants__';
import { Window } from '@/app/__components__/window';
import Image from 'next/image';

export const DearVisitor = () => {
	return (
		<Window
			label={__visitors.header}
			position={{ x: 12, y: 100 }}
			className="flex-col gap-2 px-5"
		>
			<h1 className="w-full text-2xl font-bold">Dear visitor,</h1>
			<p className="text-justify font-bold">{__visitors.descriptions}</p>
			<h1 className="flex w-full flex-row items-center justify-between text-end text-2xl font-bold">
				<Image
					src={'/favicon.svg'}
					width={100}
					height={100}
					alt="under-construction"
				/>
				<div className="flex flex-col justify-between">
					<span>Warms regret,</span>
					<span>EpenFlow@24</span>
				</div>
			</h1>
		</Window>
	);
};
