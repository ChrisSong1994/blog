'use client';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useTheme } from 'next-themes';

/**
 * 全局背景：一层细网格，用径向遮罩让它从顶部向外淡出。
 */
export function GlobalBg() {
	const { theme } = useTheme();
	// 服务端拿不到主题，先按亮色渲染，挂载后再按真实主题调整
	const mounted = useIsMounted();

	return (
		<div
			className={`absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] ${
				theme === 'dark' && mounted
					? '[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'
					: '[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'
			}`}
		/>
	);
}
