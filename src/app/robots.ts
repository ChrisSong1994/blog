import siteMetadata from '@/config/site';
import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: 'Googlebot', allow: '/' },
			{ userAgent: 'Applebot', allow: '/' },
			{ userAgent: 'bingbot', allow: '/' },
			{ userAgent: 'Baiduspider', allow: '/' },
			{ userAgent: '*', allow: '/' }
		],
		sitemap: new URL('/sitemap.xml', siteMetadata.url).href,
		host: siteMetadata.url
	};
}

// 静态导出下 metadata 路由必须显式声明为静态
export const dynamic = 'force-static';
