import { Footer } from '@/components/Footer';
import { GlobalBg } from '@/components/GlobalBg';
import { Header } from '@/components/Header';
import { Suspense } from 'react';

export default function AppLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<GlobalBg />
			{/* 内容区域盒子：居中一块半透明面板，两侧留出背景 */}
			<div className="fixed inset-0 flex justify-center sm:px-8">
				<div className="flex w-full max-w-7xl lg:px-8">
					<div className="w-full bg-zinc-50/90 opacity-95 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
				</div>
			</div>
			<div className="relative text-zinc-800 dark:text-zinc-200">
				<Header />
				<main>{children}</main>
				<Suspense>
					<Footer />
				</Suspense>
			</div>
		</>
	);
}
