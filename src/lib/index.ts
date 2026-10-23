import { toast } from 'sonner';
import { env } from '~/env.mjs';
import { asSiteBase } from './base-path';

/**
 * 构建基于当前环境的站点 URL。
 *
 * 传进来的 path 是「站点内」的路径，会拼在站点 URL 后面：
 * 站点部署在 /blog 子路径时，constructSiteUrl('/posts') 得到 …/blog/posts，
 * 而不是 …/posts（`new URL('/posts', base)` 会跳到域名根，所以先规整 base）。
 */
export function constructSiteUrl(path = '') {
	const baseUrl =
		process.env.NODE_ENV === 'production'
			? // 生产环境 env.mjs 已经用 zod 校验过，必定有值
				env.NEXT_PUBLIC_SITE_URL!
			: 'http://localhost:3000';

	return new URL(path.replace(/^\/+/, ''), asSiteBase(baseUrl));
}

/**
 * 复制文本到剪贴板。
 */
export function copyTextToClipboard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('复制成功', {
					richColors: true,
					position: 'top-center'
				});
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	} else {
		// 老浏览器兜底
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
	}
}
