'use client';

import { useEffect, useState } from 'react';

/**
 * 文章顶部的阅读进度线：只做一层 2px 的细线，不抢占内容注意力。
 * 用 rAF 合并滚动事件，避免每次 scroll 都触发 React 渲染。
 */
export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			const max =
				document.documentElement.scrollHeight - window.innerHeight;
			setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
		>
			<div
				className="h-full origin-left bg-brand/80"
				style={{ transform: `scaleX(${progress})` }}
			/>
		</div>
	);
}
