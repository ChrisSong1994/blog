import { z } from 'zod';

/**
 * 客户端可见的环境变量（会打进 bundle，务必只放公开信息）。
 * 用 `.extend()` 派生出服务端 schema，避免各版本 zod 的 merge API 差异。
 */
const client = z.object({
	NEXT_PUBLIC_SITE_URL: z.string().min(1),
	NEXT_PUBLIC_SITE_EMAIL_FROM: z.string().min(1),
	NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED: z
		.enum(['true', 'false'])
		.optional()
		.default('false')
		.transform((value) => value === 'true'),
	NEXT_PUBLIC_GOOGLE_ID: z.string().optional(),
	NEXT_PUBLIC_BAIDU_TONGJI: z.string().optional()
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
