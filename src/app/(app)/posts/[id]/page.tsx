import { HourglassIcon, TagIcon, UTurnLeftIcon } from '@/assets';
import { Container } from '@/components/Container';
import MDXComponents from '@/components/MDXComponents';
import { Separator } from '@/components/ui/separator';
import siteMetadata from '@/config/site';
import {
	getAdjacentPosts,
	getPostBySlug,
	blogPosts,
	truncateTitle
} from '@/lib/posts';
import { cn } from '@/lib/utils';
import { MDXContent } from '@content-collections/mdx/react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tag } from '../TagItem';
import Toc from '../Toc';

const variantStyles = {
	secondary:
		'group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20'
};

interface TypeParams {
	id: string;
}

/** 一篇文章都没有时的兜底页面 */
function EmptyState() {
	return (
		<Container className="mt-16 min-h-[40vh]">
			<h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
				还没有文章
			</h1>
			<p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
				在配置好的 Issues 仓库里新建一个 Issue，GitHub Actions
				会自动把它同步成文章。也可以直接在 <code>posts/</code> 目录下新建{' '}
				<code>.md</code> 或 <code>.mdx</code> 文件。
			</p>
			<Link
				href="/posts"
				className="mt-6 inline-block text-violet-500 hover:underline dark:text-violet-400"
			>
				返回博客列表
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

	return (
		<Container.Outer className="mt-10 lg:mt-16">
			<Container.Inner className="!px-0" innerClassName="lg:max-w-none">
				<div className="w-full gap-6 md:flex md:justify-between xl:relative">
					<aside className="hidden w-50 shrink-0 pl-4 lg:block xl:w-60">
						<div className="sticky top-2 pt-16">
							<Toc />
						</div>
					</aside>
					<div className="min-w-0 md:flex-1 md:shrink-0">
						<Link
							href="/posts"
							className={cn(
								'group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:hover:border-zinc-700',
								variantStyles.secondary
							)}
							aria-label="返回博客列表"
						>
							<UTurnLeftIcon className="h-8 w-8 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
						</Link>
						<article
							data-postid={post.slug}
							className="rich-text-viewer px-4"
						>
							<div className="mb-8 text-center">
								{post.cover && (
									<div className="relative mb-8 aspect-video overflow-hidden rounded-md bg-muted">
										<Image
											src={post.cover}
											alt={post.title}
											fill
											unoptimized
											className="object-cover"
										/>
									</div>
								)}
								<h1 className="text-3xl font-bold">{post.title}</h1>
								<div className="flex h-5 items-center justify-center space-x-4 text-sm">
									<time
										dateTime={post.date}
										className="mb-1 text-xs text-gray-600 dark:text-gray-400"
									>
										{dayjs(post.date).format('YYYY-MM-DD')}
									</time>
									<Separator orientation="vertical" />
									<span className="mb-1 flex items-center text-xs text-gray-600 dark:text-gray-400">
										<HourglassIcon className="mr-2" />{' '}
										{Math.ceil(post.readingTime?.minutes ?? 0)} 分钟
									</span>
								</div>
								<div className="mt-2 flex w-full justify-center gap-2">
									{post.tags?.map((tag) => (
										<Tag key={tag}>{tag}</Tag>
									))}
								</div>
								{post.description && (
									<div className="relative mt-4 rounded-md bg-gray-200 p-4 dark:bg-gray-600">
										<TagIcon className="absolute top-4 left-4" />
										<p className="text-gray-700 dark:text-gray-300">
											{post.description}
										</p>
									</div>
								)}
							</div>

							<div className="markdown-body js-toc-content">
								<MDXContent code={post.body} components={MDXComponents} />
							</div>
						</article>

						{/* 上一篇 / 下一篇 */}
						<div className="mt-8 flex justify-between px-4">
							{prevPost ? (
								<Link
									href={`/posts/${prevPost.slug}`}
									className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-violet-500 shadow-sm hover:bg-violet-200 focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:outline-none dark:text-violet-300 dark:hover:bg-violet-500"
								>
									{truncateTitle(prevPost.title)}
								</Link>
							) : (
								<span className="leading-10 text-zinc-500 dark:text-zinc-200">
									已经是第一篇了
								</span>
							)}

							{nextPost ? (
								<Link
									href={`/posts/${nextPost.slug}`}
									className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-violet-500 shadow-sm hover:bg-violet-200 focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:outline-none dark:text-violet-300 dark:hover:bg-violet-500"
								>
									{truncateTitle(nextPost.title)}
								</Link>
							) : (
								<span className="leading-10 text-zinc-500 dark:text-zinc-200">
									没有下一篇啦
								</span>
							)}
						</div>
					</div>
				</div>
			</Container.Inner>
		</Container.Outer>
	);
}
