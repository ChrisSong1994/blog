import { Container } from '@/components/Container';
import { Headline } from '@/components/IndexHeader';
import { blogPosts } from '@/lib/posts';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	const recentPosts = blogPosts.slice(0, 5);

	return (
		<Container className="min-h-[60vh]">
			<Headline />

			<section className="border-t border-border/70 pb-20" aria-labelledby="recent-posts">
				<div className="flex items-baseline justify-between pt-8">
					<h2
						id="recent-posts"
						className="font-serif text-xl font-semibold tracking-tight text-foreground"
					>
						最近文章
					</h2>
					<Link
						href="/posts"
						className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
					>
						全部文章
						<ArrowUpRight
							className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</Link>
				</div>

				{recentPosts.length > 0 ? (
					<ul className="mt-3 divide-y divide-border/60">
						{recentPosts.map((post) => (
							<li key={post.slug}>
								<Link
									href={`/posts/${post.slug}`}
									className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-4 sm:grid-cols-[6.5rem_1fr_auto]"
								>
									<time
										dateTime={post.date}
										className="hidden font-mono text-[11px] tracking-wider text-muted-foreground sm:block"
									>
										{dayjs(post.date).format('YYYY.MM.DD')}
									</time>
									<span className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
										{post.title}
									</span>
									<span className="font-mono text-[11px] tracking-wider text-muted-foreground">
										{Math.ceil(post.readingTime?.minutes ?? 0)} 分钟
									</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p className="mt-6 text-sm text-muted-foreground">
						还没有文章，稍后再来看看。
					</p>
				)}
			</section>
		</Container>
	);
}
