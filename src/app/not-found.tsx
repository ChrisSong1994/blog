import Link from 'next/link';

export default function NotFoundPage() {
	return (
		<main className="flex min-h-dvh items-center justify-center px-6">
			<div className="flex max-w-md flex-col items-start">
				<p className="eyebrow">404 / Not Found</p>
				<h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-foreground">
					这一页不存在
					<span className="text-brand">。</span>
				</h1>
				<p className="mt-4 text-sm leading-7 text-muted-foreground">
					链接可能已经失效，或者从未存在过。可以回到首页，继续读点别的。
				</p>
				<Link
					href="/"
					className="mt-8 inline-flex h-10 items-center rounded-full border border-border px-5 text-sm text-foreground transition-colors hover:border-brand/40 hover:text-brand"
				>
					返回首页
				</Link>
			</div>
		</main>
	);
}
