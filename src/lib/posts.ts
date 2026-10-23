import 'server-only';

import {
	allIssuePosts,
	allPosts as allHandwrittenPosts
} from 'content-collections';

/**
 * 两个内容源的文档结构完全一致（共用同一份 schema），
 * 这里合并成一个列表，页面只面对这一个数据源。
 */
export type Post =
	(typeof allHandwrittenPosts)[number] | (typeof allIssuePosts)[number];

/** 手写页面的 slug，只用于「关于我」这类非文章页，不进入博客列表 */
const NON_ARTICLE_SLUGS = new Set(['about']);

/** 全部文章，按日期倒序 */
export const allPosts: Post[] = [...allHandwrittenPosts, ...allIssuePosts].sort(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

/** 博客列表用的文章（剔除 about 等手写页） */
export const blogPosts: Post[] = allPosts.filter(
	(post) => !NON_ARTICLE_SLUGS.has(post.slug)
);

export function getPostBySlug(slug: string): Post | undefined {
	return allPosts.find((post) => post.slug === slug);
}

/** 手写页面（about 等），找不到时返回 undefined */
export function getPageBySlug(slug: string): Post | undefined {
	return allHandwrittenPosts.find((post) => post.slug === slug);
}

/**
 * 拿到某篇文章在博客列表中的上一篇 / 下一篇。
 * 列表按日期倒序，所以 prev 是更新的一篇，next 是更早的一篇。
 */
export function getAdjacentPosts(slug: string) {
	const index = blogPosts.findIndex((post) => post.slug === slug);
	return {
		prevPost: index > 0 ? blogPosts[index - 1] : undefined,
		nextPost: index >= 0 ? blogPosts[index + 1] : undefined
	};
}

/** 截断过长的标题，用于上一篇 / 下一篇的按钮文案 */
export function truncateTitle(title: string, max = 20) {
	return title.length > max ? `${title.slice(0, max)}...` : title;
}
