/**
 * 把 GitHub Issues 同步成 data/blog/*.mdx。
 * 用法：pnpm sync-post（本地需要 .env.local 里的 GH_TOKEN / GH_USER / GH_PROJECT_NAME）
 */
require('dotenv').config({ path: ['.env.local', '.env'] });

const GitHub = require('github-api');
const fs = require('node:fs');
const path = require('node:path');

const { GH_TOKEN, GH_USER, GH_PROJECT_NAME, GH_CREATORS } = process.env;

// 本文件在 scripts/github/ 下，要往上两级才到仓库根目录
const blogOutputPath = path.resolve(__dirname, '..', '..', 'data', 'blog');

if (!GH_USER || !GH_PROJECT_NAME) {
	console.error(
		'缺少环境变量：请在 .env.local 里配置 GH_USER 与 GH_PROJECT_NAME'
	);
	process.exit(1);
}

/**
 * 允许把 Issue 同步成文章的作者白名单。
 * 默认只认仓库所有者 GH_USER，避免别人提的 Issue 被发到博客上；
 * 需要多个时用逗号分隔，例如 GH_CREATORS="alice,bob"。
 */
const creators = (GH_CREATORS || GH_USER)
	.split(',')
	.map((name) => name.trim())
	.filter(Boolean);

const gh = new GitHub({ token: GH_TOKEN });

/**
 * Issue 正文里的 HTML 经常不闭合，而 MDX 对此是硬报错，
 * 这里做最小必要修复：<img> 补成自闭合，<br> 换成换行。
 */
function normalizeHtml(body) {
	return body
		.replace(/<img([^>]*?)\s*\/?>/g, '<img$1 />')
		.replace(/<br\s*\/?>/g, '\n');
}

/** 转义 YAML 里的双引号，避免标题里的引号写坏 frontmatter */
function yamlString(value) {
	return JSON.stringify(String(value ?? ''));
}

function generateMdx(issue, fileName) {
	const { title, labels, created_at, body, html_url, user } = issue;
	const tags = labels.map((item) => item.name);

	return `---
title: ${yamlString(title.trim())}
date: ${created_at}
slug: ${fileName}
author: ${yamlString(`${user?.login ?? ''}：${user?.html_url ?? ''}`)}
tags: ${JSON.stringify(tags)}
---

${normalizeHtml(String(body ?? ''))}

---
此文自动发布于：<a href="${html_url}" target="_blank">github issues</a>
`;
}

async function syncByCreator(creator, issueInstance) {
	// 只有 open 的 Issue 才是博文：关掉 Issue 就等于下线这篇文章
	//（main() 开头会清掉上一轮的 post-*.mdx，这里不写就自然被删掉了）。
	const { data } = await issueInstance.listIssues({ creator, state: 'open' });

	// 再兜一层，避免接口 / 缓存里混进不该同步的条目：
	// - pull_request：GitHub 的 /issues 接口会把 PR 也当成 issue 返回
	// - state !== 'open'：已关闭的 Issue
	const issues = data.filter(
		(item) => !item.pull_request && item.state === 'open'
	);
	const skippedPr = data.filter((item) => item.pull_request).length;
	const skippedClosed = data.filter(
		(item) => !item.pull_request && item.state !== 'open'
	).length;

	let successCount = 0;

	for (const item of issues) {
		try {
			const fileName = `post-${item.number}`;
			fs.writeFileSync(
				path.join(blogOutputPath, `${fileName}.mdx`),
				generateMdx(item, fileName)
			);
			successCount++;
		} catch (error) {
			console.error(`同步 #${item.number} 失败：`, error);
		}
	}

	const skippedTips = [
		skippedPr > 0 ? `跳过 ${skippedPr} 个 PR` : '',
		skippedClosed > 0 ? `跳过 ${skippedClosed} 个已关闭的 Issue` : ''
	].filter(Boolean);
	const skippedTip = skippedTips.length ? `，${skippedTips.join('，')}` : '';

	if (successCount === issues.length) {
		console.log(
			`@${creator} 的文章全部同步成功，共 ${issues.length} 篇${skippedTip}`
		);
	} else {
		console.log(
			`@${creator} 的文章同步失败 ${issues.length - successCount} 篇（共 ${issues.length} 篇）${skippedTip}`
		);
	}
}

async function main() {
	fs.mkdirSync(blogOutputPath, { recursive: true });

	// 只清掉上次同步生成的文件，手工放进 data/blog 的文件不会被删掉
	for (const file of fs.readdirSync(blogOutputPath)) {
		if (/^post-\d+\.mdx$/.test(file)) {
			fs.rmSync(path.join(blogOutputPath, file));
		}
	}

	const issueInstance = gh.getIssues(GH_USER, GH_PROJECT_NAME);

	await Promise.all(
		creators.map(async (creator) => {
			try {
				await syncByCreator(creator, issueInstance);
			} catch (error) {
				console.error(`拉取 @${creator} 的 Issues 失败：`, error);
				process.exitCode = 1;
			}
		})
	);
}

module.exports = main;
