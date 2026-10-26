import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Suspense } from 'react';

export default function AppLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-dvh flex-col bg-background text-foreground">
			<Header />
			<main className="flex-1">{children}</main>
			<Suspense>
				<Footer />
			</Suspense>
		</div>
	);
}
