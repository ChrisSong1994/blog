import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// 纯静态导出，产物在 out/，可托管到任意静态服务
	output: 'export',
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
