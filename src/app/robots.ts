import siteMetadata from '@/config/site';
import { asSiteBase } from '@/lib/base-path';
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
		// 站点在子路径下时，'/sitemap.xml' 会掉到域名根，必须按站点目录解析
		sitemap: new URL('sitemap.xml', asSiteBase(siteMetadata.url)).href,
		host: siteMetadata.url
	};
}

// 静态导出下 metadata 路由必须显式声明为静态
export const dynamic = 'force-static';
