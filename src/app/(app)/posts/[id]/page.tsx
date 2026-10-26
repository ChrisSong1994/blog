import { Container } from '@/components/Container';
import MDXComponents from '@/components/MDXComponents';
import { ReadingProgress } from '@/components/ReadingProgress';
import siteMetadata from '@/config/site';
import { withBasePath } from '@/lib/base-path';
import { blogPosts, getAdjacentPosts, getPostBySlug } from '@/lib/posts';
import { MDXContent } from '@content-collections/mdx/react';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tag } from '../TagItem';
import Toc from '../Toc';

interface TypeParams {
	id: string;
}

/** 一篇文章都没有时的兜底页面 */
function EmptyState() {
	return (
		<Container className="mt-20 min-h-[40vh]">
			<p className="eyebrow">Empty</p>
			<h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground">
				还没有文章
			</h1>
			<p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
				在配置好的 Issues 仓库里新建一个 Issue，GitHub Actions
				会自动把它同步成文章。也可以直接在 <code>posts/</code> 目录下新建{' '}
				<code>.md</code> 或 <code>.mdx</code> 文件。
			</p>
			<Link
				href="/posts"
				className="mt-8 inline-flex items-center gap-2 text-sm text-link"
			>
				返回文章列表
			</Link>
		</Container>
	);
}

/**
 * `data/blog` 在首次同步前是空的，而 `output: 'export'` 不允许
 * `generateStaticParams` 返回空数组，所以给一个哨兵值占位，
 * 命中它时页面会走 notFound()。
 */
const EMPTY_SLUG = '__empty__';

// 预渲染动态路由时生成所有可能的参数组合
export function generateStaticParams() {
	if (blogPosts.length === 0) return [{ id: EMPTY_SLUG }];
	return blogPosts.map((post) => ({ id: post.slug }));
}

// Next 16 起 params 是 Promise
export async function generateMetadata({
	params
}: {
	params: Promise<TypeParams>;
}) {
	const { id } = await params;
	const post = getPostBySlug(id);
	if (!post) return {};
	const title = post.title;
	const description =
		post.description ?? `${post.title} - ${siteMetadata.authors}`;
	return {
		title,
		description,
		keywords: post.tags?.join(','),
		openGraph: { title, description },
		twitter: { title, description, card: 'summary_large_image' }
	};
}

export default async function Page({
	params
}: {
	params: Promise<TypeParams>;
}) {
	const { id } = await params;

	// 还没有任何文章时的占位页（见上面 EMPTY_SLUG 的说明）
	if (id === EMPTY_SLUG) return <EmptyState />;

	const post = getPostBySlug(id);
	if (!post) notFound();

	const { prevPost, nextPost } = getAdjacentPosts(post.slug);
	const readingMinutes = Math.ceil(post.readingTime?.minutes ?? 0);

	return (
		<Container.Outer className="mt-8 sm:mt-12">
			<Container.Inner innerClassName="lg:max-w-none">
				<ReadingProgress />

				<div className="mx-auto flex w-full max-w-[64rem] gap-16">
					<article className="min-w-0 flex-1">
						<div className="mx-auto w-full max-w-[46rem]">
							<Link
								href="/posts"
								className="group inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowLeft
									className="size-3.5 transition-transform group-hover:-translate-x-0.5"
									aria-hidden="true"
								/>
								全部文章
							</Link>

							<header className="mt-10">
								<h1 className="font-serif text-3xl leading-[1.2] font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
									{post.title}
								</h1>

								{post.description && (
									<p className="mt-5 text-base leading-8 text-muted-foreground">
										{post.description}
									</p>
								)}

								<div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
									<time dateTime={post.date}>
										{dayjs(post.date).format('YYYY-MM-DD')}
									</time>
									<span aria-hidden="true">·</span>
									<span>{readingMinutes} 分钟阅读</span>
									{post.author && (
										<>
											<span aria-hidden="true">·</span>
											<span>{post.author}</span>
										</>
									)}
								</div>

								{post.tags?.length ? (
									<div className="mt-5 flex flex-wrap gap-2">
										{post.tags.map((tag) => (
											<Tag key={tag}>{tag}</Tag>
										))}
									</div>
								) : null}
							</header>

							{post.cover && (
								<div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-md border border-border/70 bg-surface-muted">
									<Image
										src={withBasePath(post.cover)}
										alt={post.title}
										fill
										unoptimized
										className="object-cover"
									/>
								</div>
							)}

							<div className="markdown-body js-toc-content mt-12">
								<MDXContent code={post.body} components={MDXComponents} />
							</div>

							<nav
								aria-label="文章导航"
								className="mt-16 grid gap-8 border-t border-border/70 pt-8 sm:grid-cols-2"
							>
								{prevPost ? (
									<Link href={`/posts/${prevPost.slug}`} className="group flex flex-col gap-2">
										<span className="eyebrow">更新一篇</span>
										<span className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
											{prevPost.title}
										</span>
									</Link>
								) : (
									<span />
								)}

								{nextPost ? (
									<Link
										href={`/posts/${nextPost.slug}`}
										className="group flex flex-col gap-2 sm:items-end sm:text-right"
									>
										<span className="eyebrow">更早一篇</span>
										<span className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
											{nextPost.title}
										</span>
									</Link>
								) : (
									<span />
								)}
							</nav>
						</div>
					</article>

					<aside className="hidden w-56 shrink-0 lg:block">
						<div className="sticky top-24">
							<Toc />
						</div>
					</aside>
				</div>
			</Container.Inner>
		</Container.Outer>
	);
}
