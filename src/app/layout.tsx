import { DEFAULT_TEXT } from '@/constants/text';
import GlobalStyles from '@/styles/GlobalStyles';
import './global.css';
import { Metadata } from 'next';
import EFLogoSVG from '/public/EFLogoSVG.svg';
export const metadata: Metadata = {
	title: 'EPEN FLOW',
	description: DEFAULT_TEXT.description,
	themeColor: 'black',
	icons: EFLogoSVG.src,
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
