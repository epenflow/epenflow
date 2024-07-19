import { __visitors } from '@/app/__components__/__constants__';
import { Window } from '@/app/__components__/window';

export const DearVisitor = () => {
	return (
		<Window
			label={__visitors.header}
			position={{ x: 12, y: 100 }}
			className="gap-2 px-5 lg:justify-center"
		>
			<h1 className="w-full text-2xl font-bold">Dear visitor,</h1>
			<p className="text-justify font-bold">{__visitors.descriptions}</p>
			<h1 className="flex w-full flex-col text-end text-2xl font-bold">
				<span>Warms regret,</span>
				<span>EpenFlow@24</span>
			</h1>
		</Window>
	);
};
