'use client';

import { useIsMounted } from '@/hooks/useIsMounted';
import { withBasePath } from '@/lib/base-path';
import 'client-only';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import useThemeToggleAnimation from '../hooks/useThemeToggleAnimation';
import { Toaster } from './ui/sonner';

export default function ThemeToggle() {
	// 主题只有挂载后才拿得到，先占一个同尺寸的空位，避免布局跳动
	const mounted = useIsMounted();
	const { resolvedTheme, setTheme } = useTheme();
	const toggleRef = useRef<HTMLButtonElement>(null);
	const isDarkMode = resolvedTheme === 'dark';

	const { toggleDarkMode } = useThemeToggleAnimation({
		domRef: toggleRef,
		isDarkMode,
		onThemeChange: (t) => setTheme(t)
	});

	// 按主题切换代码高亮样式表
	useEffect(() => {
		if (!resolvedTheme) return;

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = withBasePath(
			isDarkMode
				? '/style/prism-github-dark.css'
				: '/style/prism-github-light.css'
		);
		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link);
		};
	}, [isDarkMode, resolvedTheme]);

	if (!mounted) {
		return <div className="size-9" aria-hidden="true" />;
	}

	return (
		<>
			<button
				ref={toggleRef}
				type="button"
				onClick={() => void toggleDarkMode()}
				aria-label={isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
				title={isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
				className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
			>
				{isDarkMode ? (
					<Sun className="size-[15px]" strokeWidth={1.6} />
				) : (
					<Moon className="size-[15px]" strokeWidth={1.6} />
				)}
			</button>
			<Toaster theme={isDarkMode ? 'dark' : 'light'} richColors />
		</>
	);
}
