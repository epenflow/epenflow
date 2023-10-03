import { DEFAULT_TEXT } from '@/constants/text';
import GlobalStyles from '@/styles/GlobalStyles';
import './global.css';
export const metadata = {
	title: 'EPEN FLOW',
	description: DEFAULT_TEXT.description,
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<GlobalStyles />
				{children}
			</body>
		</html>
	);
}
