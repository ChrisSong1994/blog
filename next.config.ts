import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';

// GitHub Pages 的项目站点部署在 /blog 子路径下，CI 构建时注入 NEXT_PUBLIC_BASE_PATH；
// 根域名部署（自有域名、Vercel）留空即可。它会被打进客户端包，改完必须重新构建。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
	// 纯静态导出，产物在 out/，可托管到任意静态服务
	output: 'export',
	basePath,
	reactStrictMode: true,

	// 静态导出不支持默认的图片优化器；远程图片（issues 里的图床链接）直接原样输出
	images: {
		unoptimized: true
	},

	reactCompiler: true,

	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css'
			}
		}
	}
};

// withContentCollections 必须是最外层插件：它返回 Promise，其他插件不一定能处理
export default withContentCollections(nextConfig);
