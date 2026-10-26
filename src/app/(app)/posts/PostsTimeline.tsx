'use client';

import type { Post } from '@/lib/posts';
import dayjs from 'dayjs';
import { ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Tag } from './TagItem';

interface PostsTimelineProps {
	posts: Post[];
}

interface GroupedPosts {
	year: string;
	items: Post[];
}

export function PostsTimeline({ posts }: PostsTimelineProps) {
	const [query, setQuery] = useState('');
	const normalizedQuery = query.trim().toLowerCase();

	const filteredPosts = useMemo(() => {
		if (!normalizedQuery) return posts;

		return posts.filter((post) => {
			const haystack = [post.title, post.description, ...(post.tags ?? [])]
				.join(' ')
				.toLowerCase();
			return haystack.includes(normalizedQuery);
		});
	}, [posts, normalizedQuery]);

	const groupedPosts = useMemo<GroupedPosts[]>(() => {
		const map = new Map<string, Post[]>();

		for (const post of filteredPosts) {
			const year = dayjs(post.date).format('YYYY');
			const bucket = map.get(year);
			if (bucket) {
				bucket.push(post);
			} else {
				map.set(year, [post]);
			}
		}

		return Array.from(map.entries())
			.map(([year, items]) => ({ year, items }))
			.sort((a, b) => Number(b.year) - Number(a.year));
	}, [filteredPosts]);

	return (
		<div>
			<div className="mt-8 flex items-center justify-between gap-6 border-b border-border/60 pb-3">
				<div className="relative w-full max-w-xs">
					<Search
						className="pointer-events-none absolute top-1/2 left-0 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索标题、标签或摘要"
						aria-label="搜索文章"
						className="w-full border-0 bg-transparent py-1 pr-3 pl-6 text-sm text-foreground placeholder:text-muted-foreground/70 focus:ring-0 focus:outline-none"
					/>
				</div>
				<span className="shrink-0 font-mono text-[11px] tracking-wider text-muted-foreground">
					{filteredPosts.length} 篇
				</span>
			</div>

			{filteredPosts.length === 0 ? (
				<p className="mt-10 text-sm text-muted-foreground">
					没有找到与“<span className="text-foreground">{query}</span>”相关的文章。
				</p>
			) : (
				<div className="mt-12 space-y-16">
					{groupedPosts.map(({ year, items }) => (
						<section key={year} aria-labelledby={`year-${year}`}>
							<div className="flex items-baseline justify-between border-b border-border/70 pb-3">
								<h2
									id={`year-${year}`}
									className="font-serif text-2xl font-semibold tracking-tight text-foreground"
								>
									{year}
								</h2>
								<span className="font-mono text-[11px] tracking-wider text-muted-foreground">
									{String(items.length).padStart(2, '0')} 篇
								</span>
							</div>

							<ul className="divide-y divide-border/50">
								{items.map((post) => (
									<li key={post.slug}>
										<Link
											href={`/posts/${post.slug}`}
											className="group grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[5.5rem_1fr_1rem]"
										>
											<time
												dateTime={post.date}
												className="font-mono text-[11px] tracking-wider text-muted-foreground sm:pt-1.5"
											>
												{dayjs(post.date).format('MM.DD')}
											</time>

											<div className="min-w-0">
												<h3 className="font-serif text-lg leading-snug font-medium text-foreground transition-colors group-hover:text-brand">
													{post.title}
												</h3>
												{post.description ? (
													<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
														{post.description}
													</p>
												) : null}
												{post.tags?.length ? (
													<div className="mt-3 flex flex-wrap gap-2">
														{post.tags.map((tag) => (
															<Tag key={tag}>{tag}</Tag>
														))}
													</div>
												) : null}
											</div>

											<ArrowUpRight
												className="hidden size-4 translate-y-1.5 text-muted-foreground opacity-0 transition-all group-hover:translate-y-1 group-hover:text-brand group-hover:opacity-100 sm:block"
												aria-hidden="true"
											/>
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
