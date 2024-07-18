'use client';

import { Else } from '@/components/If/else';
import { If } from '@/components/If/if';
import { Then } from '@/components/If/then';

export const __TestIf = () => {
	return (
		<If condition={false}>
			<Then>
				<p>then</p>
			</Then>
			<Else>
				<p>else</p>
			</Else>
		</If>
	);
};
