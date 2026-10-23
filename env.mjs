import { z } from 'zod';

/**
 * `.env` 里把变量留空（`FOO=""`）时拿到的是空字符串，不是 undefined。
 * 空串会绕过 `??` 这类兜底，也让「没配」和「配了个空值」两种状态混在一起，
 * 所以统一先归一化成 undefined，再交给后面的 schema 判断。
 */
const emptyAsUndefined = (value) =>
	typeof value === 'string' && value.trim() === '' ? undefined : value;

/**
 * 站点域名：必须是带协议的完整 URL，末尾斜杠统一去掉，
 * 因为下游全是 `new URL(path, baseUrl)` 和字符串拼接（如 `${url}og.png`）。
 */
const siteUrl = z
	.string()
	.trim()
	.transform((value) => value.replace(/\/+$/, ''))
	.pipe(z.url({ protocol: /^https?$/, error: '需要是 http(s) 开头的完整 URL' }));

/**
 * 客户端可见的环境变量（会打进 bundle，务必只放公开信息）。
 * 用 `.extend()` 派生出服务端 schema，避免各版本 zod 的 merge API 差异。
 *
 * 本地开发时域名不影响任何功能（页面链接由 Next 自己生成），
 * 缺省给 localhost，省得每建一个 .env 都要先填域名；
 * 生产构建则必须显式配置，否则 canonical / sitemap / RSS 全是错的。
 */
const client = z.object({
	// preprocess 必须包在最外层：`.default()` 只对 undefined 生效，
	// 空字符串要先被归一化成 undefined，default 才会被触发。
	NEXT_PUBLIC_SITE_URL: z.preprocess(
		emptyAsUndefined,
		process.env.NODE_ENV === 'production'
			? siteUrl
			: siteUrl.default('http://localhost:3000')
	),
	NEXT_PUBLIC_SITE_EMAIL_FROM: z.preprocess(
		emptyAsUndefined,
		z
			.string()
			.trim()
			.pipe(z.email({ error: '需要是合法的邮箱地址' }))
			.default('noreply@example.com')
	),
	NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED: z.preprocess(
		emptyAsUndefined,
		z
			.enum(['true', 'false'])
			.default('false')
			.transform((value) => value === 'true')
	),
	NEXT_PUBLIC_GOOGLE_ID: z.preprocess(emptyAsUndefined, z.string().optional()),
	NEXT_PUBLIC_BAIDU_TONGJI: z.preprocess(
		emptyAsUndefined,
		z.string().optional()
	)
});

/** 仅服务端可见的环境变量 */
const server = client.extend({
	NODE_ENV: z.enum(['development', 'test', 'production']),
	VERCEL_ENV: z
		.enum(['development', 'preview', 'production'])
		.optional()
		.default('development')
});

/**
 * Next.js 的 edge runtime / 客户端里不能对 `process.env` 做解构，
 * 所以这里手动挑一遍。
 */
const processEnv = {
	NODE_ENV: process.env.NODE_ENV,
	VERCEL_ENV: process.env.VERCEL_ENV,
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	NEXT_PUBLIC_SITE_EMAIL_FROM: process.env.NEXT_PUBLIC_SITE_EMAIL_FROM,
	NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED:
		process.env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED,
	NEXT_PUBLIC_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ID,
	NEXT_PUBLIC_BAIDU_TONGJI: process.env.NEXT_PUBLIC_BAIDU_TONGJI
};

let env = process.env;

if (process.env.SKIP_ENV_VALIDATION !== 'true') {
	const isServer = typeof window === 'undefined';

	const parsed = isServer
		? server.safeParse(processEnv)
		: client.safeParse(processEnv);

	if (parsed.success === false) {
		console.error('❌ Invalid environment variables:', parsed.error.issues);
		throw new Error('Invalid environment variables');
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== 'string') return undefined;
			// 在客户端访问服务端变量时给出明确报错，否则只会得到 undefined，很难排查
			if (!isServer && !prop.startsWith('NEXT_PUBLIC_')) {
				throw new Error(
					process.env.NODE_ENV === 'production'
						? '❌ Attempted to access a server-side environment variable on the client'
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`
				);
			}
			return target[prop];
		}
	});
}

export { env };
