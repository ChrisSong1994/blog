import BaiDuAnalytics from '@/components/BaiDuAnalytics';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import siteMetadata from '@/config/site';
import { withBasePath } from '@/lib/base-path';
import { constructSiteUrl } from '@/lib';
import { sansFont } from '@/lib/font';
import { type Viewport, type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
	metadataBase: new URL(siteMetadata.url),
	title: {
		template: '%s | ' + siteMetadata.authors,
		default: siteMetadata.authorsCN
	},
	description: siteMetadata.description,
	keywords: siteMetadata.keywords,
	// metadata 里的路径不会自动补 basePath，子路径部署时必须手动加
	manifest: withBasePath('/site.webmanifest'),
	openGraph: siteMetadata.openGraph,
	twitter: siteMetadata.twitter,
	alternates: {
		canonical: constructSiteUrl('/').href,
		types: {
			// 用绝对地址：metadataBase 指向带子路径的站点根，相对路径会被再拼一次前缀
			'application/rss+xml': [
				{ url: constructSiteUrl('/feed.xml').href, title: 'RSS 订阅' }
			]
		}
	},
	other: {
		// 在 .env.local 里配置，留空则不下发对应的校验 meta
		...(process.env.NEXT_PUBLIC_BAIDU_VERIFICATION
			? {
					'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION
				}
			: {}),
		...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
			? {
					'google-site-verification':
						process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
				}
			: {})
	}
};

export const viewport: Viewport = {
	themeColor: siteMetadata.themeColors
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
			lang={siteMetadata.locale}
			suppressHydrationWarning
		>
			<body>
				<GoogleAnalytics />
				<BaiDuAnalytics />
				<ThemeProvider
					attribute="class"
					defaultTheme={siteMetadata.defaultNextTheme ?? 'system'}
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
