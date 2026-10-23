/**
 * GitHub Pages 的项目站点（`<user>.github.io/<repo>`）挂在子路径下，
 * 构建时由 NEXT_PUBLIC_BASE_PATH 注入（见 .github/workflows/deploy.yml）；
 * 部署在根域名（自有域名、Vercel）时留空。
 *
 * 这个模块要同时跑在服务端和客户端，所以不能引任何依赖：
 * 客户端组件靠 NEXT_PUBLIC_ 前缀在打包时被替换成字面量。
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * 给站内绝对路径补上 basePath。
 *
 * next/link 会自动补，但 next/image、metadata（manifest / icons / og:image）
 * 和 public/ 下的文件（CSS、二维码、项目图标）不会，必须自己加。
 * 外部链接和 data: URI 原样返回。
 */
export function withBasePath(path: string) {
	return path.startsWith('/') ? `${basePath}${path}` : path;
}

/**
 * usePathname() 返回的路径是带 basePath 的，和导航配置里的 href 比较前要先剥掉。
 */
export function stripBasePath(pathname: string) {
	if (!basePath || !pathname.startsWith(basePath)) {
		return pathname;
	}

	return pathname.slice(basePath.length) || '/';
}

/**
 * 把站点 URL 规整成「目录」形式（补结尾斜杠）。
 *
 * 站点挂在子路径下时（如 `https://x.github.io/blog`），
 * `new URL('/posts', base)` 会丢掉 `/blog` 直接指到域名根，
 * 只有把 base 当成目录、再用相对路径解析才能保留子路径。
 */
export function asSiteBase(url: string) {
	return url.endsWith('/') ? url : `${url}/`;
}
