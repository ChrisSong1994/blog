/**
 * 从文件名推导 slug。
 *
 * frontmatter 里没写 `slug` 时用它兜底，保证 `.md` / `.mdx` 都能进列表：
 * - 去掉扩展名
 * - 去掉 `01-`、`02_` 这类只用于目录排序的前缀
 * - 空格 / 下划线统一成 `-`，英文转小写（中文原样保留）
 *
 * content-collections.ts 和 scripts/generate-rss.js 共用这份逻辑，
 * 避免两处算出来的地址不一致。
 */
function slugFromFileName(fileName) {
	return fileName
		.replace(/\.mdx?$/i, '')
		.replace(/^\d+\s*[-_.]\s*/, '')
		.trim()
		.toLowerCase()
		.replace(/[\s_]+/g, '-');
}

module.exports = { slugFromFileName };
