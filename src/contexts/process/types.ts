export interface ComponentProcessProps {
	id: string;
}
export type Processes = Record<
	string,
	{
		Component: React.ComponentType<ComponentProcessProps>;
		hasWindow?: boolean;
	}
>;

export type ProcessContext = {
	processes: Processes;
};
