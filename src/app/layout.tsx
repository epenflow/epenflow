import { ProcessProvider } from "@/contexts/process";
import { SessionProvider } from "@/contexts/session";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<SessionProvider>
					<ProcessProvider>{children}</ProcessProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
