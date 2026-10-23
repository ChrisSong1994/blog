'use client';

import '@/style/tocbot.css';
import { motion, type Variants } from 'motion/react';
import { useEffect } from 'react';
import tocbot from 'tocbot';

const listVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: 'beforeChildren',
			staggerChildren: 0.08,
			delay: 0.255,
			type: 'spring',
			stiffness: 150,
			damping: 20
		}
	}
};

/**
 * 文章右侧目录。tocbot 直接读 DOM 里的 h1~h6 生成锚点列表，
 * 所以文章正文必须包在 `.js-toc-content` 里。
 */
export default function Toc() {
	useEffect(() => {
		tocbot.init({
			tocSelector: '.js-toc',
			contentSelector: '.js-toc-content',
			headingSelector: 'h1, h2, h3, h4, h5, h6',
			linkClass: 'toc-link',
			activeListItemClass: 'is-active-li',
			listClass: 'toc-list',
			listItemClass: 'toc-list-item',
			collapseDepth: 6,
			scrollSmooth: true,
			scrollSmoothDuration: 420,
			scrollSmoothOffset: -10
		});

		return () => {
			tocbot.destroy();
		};
	}, []);

	return (
		<div className="toc-container">
			<h2 className="mb-4 text-lg font-semibold">目录</h2>
			<motion.ul
				className="js-toc group pointer-events-auto flex flex-col space-y-2 text-zinc-500 dark:text-zinc-400"
				initial="hidden"
				animate="visible"
				variants={listVariants}
			/>
		</div>
	);
}
