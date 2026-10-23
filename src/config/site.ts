import { withBasePath } from '@/lib/base-path';
import type { SiteConfig } from '@/types/siteConfig';
// 站点名称 / 简介 / 作者这些「构建脚本也要读」的字段放在 site.config.json，
// 这样 scripts/generate-rss.js 能直接 require 同一份，不会出现两处写法不一致。
import sharedSiteConfig from '~/site.config.json';

// ★★★ 站点信息唯一入口：改这里 + site.config.json 就能完成整站换皮 ★★★
// 带 `TODO` 的地方都是占位符，替换成你自己的信息即可。
// 用 `||` 而不是 `??`：.env 里写成 NEXT_PUBLIC_SITE_URL="" 时拿到的是空串，
// `??` 会当成「有值」直接传给 new URL()，抛 Invalid URL。
const url = new URL(
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_SITE_URL || sharedSiteConfig.url
		: 'http://localhost:3000'
);

export const baseSiteConfig: SiteConfig = {
	name: sharedSiteConfig.name, // TODO: site.config.json
	description: sharedSiteConfig.description, // TODO: site.config.json
	url: url.href,
	// 网站预览图（放在 public/ 下）。metadata 里的图片路径不会自动补 basePath，
	// 这里统一拼成绝对地址，顺带避免 `${url}og.png` 在 url 没有结尾斜杠时拼错。
	ogImage: new URL(withBasePath('/og.png'), url.origin).href,
	metadataBase: '/',
	keywords: ['blog', '前端', '开发者', '编程', '学习笔记', '程序员'], // TODO
	authors: sharedSiteConfig.authors, // TODO：英文名 / 昵称，用于版权与 metadata 模板
	email: sharedSiteConfig.email, // TODO
	authorsCN: sharedSiteConfig.authorsCN, // TODO：中文名，首页与页脚展示
	authorsUrl: 'https://github.com/your-github-name', // TODO
	social: [
		{
			href: 'https://github.com/your-github-name', // TODO
			text: 'github',
			icon: 'GitHubIcon'
		},
		// isPicture: true 的项会用二维码图片弹窗展示，
		// 图片在 public/media/{href}.png，替换成你自己的二维码即可
		{
			href: 'wx',
			text: '微信',
			isPicture: true,
			icon: 'WxIcon',
			hide: true
		},
		{
			href: 'wxPublic',
			text: '微信公众号',
			isPicture: true,
			icon: 'WxMediaIcon',
			hide: true
		},
		{
			href: 'you@example.com', // TODO
			text: '邮箱',
			icon: 'MailIcon'
		},
		{
			href: 'https://juejin.cn/user/your-id', // TODO
			text: '掘金',
			icon: 'JueJinIcon',
			hide: true
		},
		{
			href: 'https://x.com/your-id', // TODO
			text: '推特（X）',
			icon: 'XIcon',
			hide: true
		}
	],
	themeColors: [
		{ media: '(prefers-color-scheme: dark)', color: '#000212' },
		{ media: '(prefers-color-scheme: light)', color: '#fafafa' }
	],
	defaultNextTheme: 'system', // next-themes 选项：system | dark | light
	icons: {
		icon: withBasePath('/favicon.ico'),
		shortcut: withBasePath('/logo.png'),
		apple: withBasePath('/logo.png')
	},
	// 留空则不渲染页脚的备案信息
	beian: '', // TODO，例如：浙ICP备2021039023号-3
	// 留空则不渲染页脚的源码链接
	repoUrl: '', // TODO，例如：https://github.com/your-github-name/blog
	navigationItems: [
		{ href: '/', text: '首页' },
		{ href: '/posts', text: '博客' },
		{ href: '/projects', text: '项目' },
		{ href: '/about', text: '关于我' },
		{ href: '/feed.xml', text: 'rss' }
	],
	moreItems: {
		'/more': [
			{
				href: '/icon',
				text: '图标库'
			}
		]
	},
	footerItems: [{ href: '/', text: '首页' }],
	locale: sharedSiteConfig.locale,
	siteHostList: [url.host]
};

const siteMetadata: SiteConfig = {
	...baseSiteConfig,
	openGraph: {
		type: 'website',
		locale: baseSiteConfig.locale,
		url: baseSiteConfig.url,
		title: baseSiteConfig.authors + baseSiteConfig.name,
		description: baseSiteConfig.description,
		siteName: baseSiteConfig.name,
		images: [baseSiteConfig.ogImage]
	},
	twitter: {
		card: 'summary_large_image',
		title: baseSiteConfig.authors + baseSiteConfig.name,
		description: baseSiteConfig.description,
		images: [baseSiteConfig.ogImage],
		creator: '' // TODO
	}
};

export default siteMetadata;
