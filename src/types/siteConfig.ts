export type AuthorsConfig = {
	name: string;
	url: string;
	twitter?: string;
};

export type ProductLink = {
	url: string;
	name: string;
};

export type navigationItem = {
	text: string;
	href: string;
	icon?: string;
	menu?: boolean;
};

export type ThemeColor = {
	media: string;
	color: string;
};

export type socialItem = {
	text: string;
	href: string;
	/** 是否用二维码图片弹窗展示（微信、公众号等） */
	isPicture?: boolean;
	hide?: boolean;
	icon: string;
};

export type moreItem = Record<string, navigationItem[]>;

export type SiteConfig = {
	name: string;
	authorsCN: string;
	description: string;
	url: string;
	email: string;
	siteHostList: string[];
	keywords: string[];
	authors: string;
	authorsUrl?: string;
	ogImage: string;
	social: socialItem[];
	navigationItems: navigationItem[];
	moreItems: moreItem;
	footerItems: navigationItem[];
	metadataBase: URL | string;
	themeColors?: string | ThemeColor[];
	defaultNextTheme?: string;
	icons: {
		icon: string;
		shortcut?: string;
		apple?: string;
	};
	/** ICP 备案号，留空则不显示 */
	beian?: string;
	/** 站点源码仓库，会显示在页脚，留空则不显示 */
	repoUrl?: string;
	openGraph?: {
		type: string;
		locale: string;
		url: string;
		title: string;
		description: string;
		siteName: string;
		images?: string[];
	};
	twitter?: {
		card: string;
		title: string;
		description: string;
		images?: string[];
		creator: string;
	};
	locale: string;
};
