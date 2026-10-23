import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// 关掉与 Prettier 冲突的格式化规则，格式统一交给 prettier
	prettier,
	// 覆盖 eslint-config-next 的默认忽略项
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		// 自动生成的产物
		'.content-collections/**',
		'public/feed.xml'
	]),
	{
		// 构建 / 同步脚本是 Node 里直接跑的 CommonJS，允许 require
		files: ['scripts/**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				process: 'readonly',
				console: 'readonly',
				__dirname: 'readonly'
			}
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'no-console': 'off'
		}
	}
]);

export default eslintConfig;
