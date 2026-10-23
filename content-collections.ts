import {
	defineCollection,
	defineConfig,
	type Document,
	type Meta
} from '@content-collections/core';
import { slugFromFileName } from './scripts/lib/slug.js';
import { compileMDX } from '@content-collections/mdx';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

/**
 * 与 contentlayer.config.ts 里等价的 rehype / remark 管线：
 * GFM、代码高亮、标题锚点 id、以及标题自带的 `#` 链接。
 */
const mdxOptions = {
	remarkPlugins: [remarkGfm],
	rehypePlugins: [
		[rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{ behavior: 'wrap', properties: { className: ['anchor'] } }
		]
	]
} satisfies Parameters<typeof compileMDX>[2];

/**
 * Content Collections 0.15 起 `schema` 必须直接给一个 Standard Schema
 * （zod 4 的 schema 天然满足），不再支持 `(z) => ({...})` 函数写法。
 *
 * 注意 `slug` 是可选的：不写时由 transform 按文件名兜底，
 * 避免漏写 slug 的文章被静默丢掉。
 */
const postSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]),
	slug: z.string().optional(),
	author: z.string().optional(),
	cover: z.string().optional(),
	// frontmatter 里的日期会被 YAML 解析成 Date，也可能写成字符串
	date: z
		.union([z.string(), z.date()])
		.transform((value) => new Date(value).toISOString()),
	// frontmatter 解析器会把正文一并交过来
	content: z.string()
});

/**
 * 编译正文。`.md` 和 `.mdx` 走同一条 MDX 管线（MDX 是 Markdown 的超集），
 * 区别只是 `.md` 里不要写 JSX —— 裸的 `<Foo>` 会被当成组件标签而报错。
 *
 * 编译失败时把源文件路径带进错误信息：Content Collections 默认只会抛出
 * esbuild 的临时文件名，排查起来完全对不上号。
 */
async function compileBody(
	document: Document & { content: string; _meta: Meta },
	context: Parameters<typeof compileMDX>[0]
) {
	try {
		return await compileMDX(context, document, mdxOptions);
	} catch (error) {
		throw new Error(
			`文章 ${document._meta.directory}/${document._meta.fileName} 编译失败（.md 文件里不能出现裸的 <标签>，需要时请用 \`\` 包成代码或用 \\< 转义）：\n${String(error)}`
		);
	}
}

/**
 * posts/ 放手写页面（about 等），data/blog/ 放 scripts/sync-post.js
 * 从 GitHub Issues 同步过来的文章。两边共用一套 schema。
 *
 * `.md` 和 `.mdx` 都收：纯 Markdown 用 `.md` 写更顺手，
 * 需要 JSX / 组件时再用 `.mdx`，两者走同一条编译管线。
 */
function definePostCollection(name: string, directory: string) {
	return defineCollection({
		name,
		directory,
		include: ['**/*.mdx', '**/*.md'],
		schema: postSchema,
		transform: async (document, context) => {
			const { minutes, words, text, time } = readingTime(document.content);
			// frontmatter 没写 slug 时用文件名兜底（去掉 `01-` 前缀和扩展名）
			const slug = document.slug ?? slugFromFileName(document._meta.fileName);
			return {
				...document,
				slug,
				body: await compileBody(document, context),
				url: `/posts/${slug}`,
				// 展开成普通对象：reading-time 返回的是 interface，
				// 直接塞进去会不满足 Content Collections 的可序列化校验
				readingTime: { minutes, words, text, time }
			};
		}
	});
}

const posts = definePostCollection('posts', 'posts');
const issuePosts = definePostCollection('issuePosts', 'data/blog');

export default defineConfig({
	content: [posts, issuePosts]
});
