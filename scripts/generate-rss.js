/**
 * 构建前生成 public/feed.xml。
 * 站点名称 / 简介 / 域名与 src/config/site.ts 共用 site.config.json，
 * 所以改一处即可两边生效。
 */
require('dotenv').config({ path: ['.env.local', '.env'] });

const { promises: fs } = require('fs');
const path = require('path');
const RSS = require('rss');
const matter = require('gray-matter');
const { slugFromFileName } = require('./lib/slug');

const siteConfig = require('../site.config.json');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const FEED_PATH = path.join(__dirname, '..', 'public', 'feed.xml');

/** about 之类的静态页不进 RSS */
const NON_ARTICLE_SLUGS = new Set(['about']);

/** 只同步这些目录下的 .md / .mdx：data/blog 由 sync-post 生成，posts 是手写页面 */
const CONTENT_DIRS = ['data/blog', 'posts'];

async function collectPosts() {
	const groups = await Promise.all(
		CONTENT_DIRS.map(async (dir) => {
			const absolute = path.join(__dirname, '..', dir);
			let files;
			try {
				files = await fs.readdir(absolute);
			} catch {
				return [];
			}
			return files
				.filter((file) => /\.mdx?$/.test(file))
				.map((file) => path.join(absolute, file));
		})
	);

	return groups.flat();
}

async function generate() {
	const feed = new RSS({
		title: siteConfig.name,
		description: siteConfig.description,
		site_url: SITE_URL,
		feed_url: new URL('/feed.xml', SITE_URL).href,
		language: siteConfig.locale
	});

	const files = await collectPosts();

	const items = (
		await Promise.all(
			files.map(async (file) => {
				const frontmatter = matter(await fs.readFile(file, 'utf8')).data;
				// 与 content-collections.ts 保持一致：没写 slug 就按文件名推导
				const slug = frontmatter.slug ?? slugFromFileName(path.basename(file));

				if (NON_ARTICLE_SLUGS.has(slug)) return null;
				if (!frontmatter.title || !frontmatter.date) {
					console.warn(`跳过 ${file}：缺少 title 或 date`);
					return null;
				}

				return {
					title: frontmatter.title,
					description: frontmatter.description ?? frontmatter.title,
					url: new URL(`/posts/${slug}`, SITE_URL).href,
					date: new Date(frontmatter.date),
					categories: frontmatter.tags ?? []
				};
			})
		)
	)
		.filter(Boolean)
		.sort((a, b) => b.date.getTime() - a.date.getTime());

	for (const item of items) {
		feed.item(item);
	}

	await fs.writeFile(FEED_PATH, feed.xml({ indent: true }));
	console.log(`✅ feed.xml 已生成，共 ${items.length} 篇文章`);
}

module.exports = generate;

// 直接 `node scripts/generate-rss.js` 时执行
if (require.main === module) {
	generate().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
