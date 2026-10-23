'use client';

import { flushSync } from 'react-dom';

/** View Transition API 在部分 TS DOM lib 里还没声明，这里显式约束一下 */
type DocumentWithViewTransition = Document & {
	startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * 主题切换：用 View Transition API 做一次整体淡入。
 * 不支持该 API 的浏览器会直接走 onThemeChange（降级为无动画切换）。
 */
export default function useThemeToggleAnimation({
	isDarkMode,
	domRef,
	onThemeChange
}: {
	domRef: React.RefObject<HTMLElement | null>;
	isDarkMode: boolean;
	onThemeChange: (theme: string) => void;
}) {
	const toggleDarkMode = async () => {
		const nextTheme = isDarkMode ? 'light' : 'dark';

		// 只在浏览器里访问 document（SSR 预渲染时不存在）
		const doc = document as DocumentWithViewTransition;

		// 没有 View Transition 支持时直接切换
		if (typeof doc.startViewTransition !== 'function') {
			onThemeChange(nextTheme);
			return;
		}

		await doc.startViewTransition(() => {
			flushSync(() => {
				onThemeChange(nextTheme);
			});
		}).ready;

		document.documentElement.animate(
			{ opacity: [0, 1] },
			{
				duration: 500,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)'
			}
		);
	};

	return { toggleDarkMode, domRef };
}
