'use client';

import { Switch } from '@/components/ui/switch';
import { useIsMounted } from '@/hooks/useIsMounted';
import { withBasePath } from '@/lib/base-path';
import 'client-only';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import useThemeToggleAnimation from '../hooks/useThemeToggleAnimation';
import { Toaster } from './ui/sonner';

const spring = {
	type: 'spring',
	stiffness: 900,
	damping: 80
} as const;

export default function ThemeToggle() {
	// 主题只有挂载后才拿得到，先不渲染，避免闪一下再跳成另一个主题
	const mounted = useIsMounted();
	const { theme, setTheme } = useTheme();
	const toggleRef = useRef<HTMLButtonElement>(null);
	const isDarkMode = theme === 'dark';

	const { toggleDarkMode } = useThemeToggleAnimation({
		domRef: toggleRef,
		isDarkMode,
		onThemeChange: (t) => setTheme(t)
	});

	// 按主题切换代码高亮样式表
	useEffect(() => {
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
	}, [isDarkMode]);

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex items-center space-x-2">
			<Switch
				ref={toggleRef}
				id="theme-toggle"
				aria-label="切换主题"
				checked={isDarkMode}
				onCheckedChange={() => void toggleDarkMode()}
				className="h-8 w-16 px-1"
			>
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 20, opacity: 0 }}
					layout
					transition={spring}
				>
					{isDarkMode ? (
						<Moon className="ml-[2px] h-5 w-5 text-violet-400" />
					) : (
						<Sun className="h-5 w-5 text-violet-500" />
					)}
				</motion.div>
			</Switch>
			<Toaster theme={isDarkMode ? 'dark' : 'light'} richColors />
		</div>
	);
}
