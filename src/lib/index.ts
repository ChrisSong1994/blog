import { toast } from 'sonner';
import { env } from '~/env.mjs';

/**
 * 构建基于当前环境的站点 URL。
 */
export function constructSiteUrl(path = '') {
	const baseUrl =
		process.env.NODE_ENV === 'production'
			? env.NEXT_PUBLIC_SITE_URL
			: 'http://localhost:3000';

	return new URL(path, baseUrl);
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
