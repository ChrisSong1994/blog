import { constructSiteUrl } from '@/lib';
import { blogPosts } from '@/lib/posts';
import { type MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const staticMap = [
		{ url: constructSiteUrl('/').href, lastModified: new Date() },
		{ url: constructSiteUrl('/posts').href, lastModified: new Date() },
		{ url: constructSiteUrl('/projects').href, lastModified: new Date() },
		{ url: constructSiteUrl('/about').href, lastModified: new Date() }
	] satisfies MetadataRoute.Sitemap;

	const dynamicMap = blogPosts.map((post) => ({
		url: constructSiteUrl(`/posts/${post.slug}`).href,
		lastModified: new Date(post.date)
	})) satisfies MetadataRoute.Sitemap;

	return [...staticMap, ...dynamicMap];
}

// 静态导出下 metadata 路由必须显式声明为静态
export const dynamic = 'force-static';
