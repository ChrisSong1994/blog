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
			staggerChildren: 0.05,
			delay: 0.2
		}
	}
};

/**
 * 文章右侧目录。tocbot 直接读 DOM 里的 h2/h3 生成锚点列表，
 * 所以文章正文必须包在 `.js-toc-content` 里。
 */
export default function Toc() {
	useEffect(() => {
		tocbot.init({
			tocSelector: '.js-toc',
			contentSelector: '.js-toc-content',
			headingSelector: 'h2, h3',
			linkClass: 'toc-link',
			activeListItemClass: 'is-active-li',
			listClass: 'toc-list',
			listItemClass: 'toc-list-item',
			collapseDepth: 3,
			scrollSmooth: true,
			scrollSmoothDuration: 420,
			scrollSmoothOffset: -80
		});

		return () => {
			tocbot.destroy();
		};
	}, []);

	return (
		<div className="toc-container">
			<h2 className="eyebrow mb-4">目录</h2>
			<motion.ul
				className="js-toc flex flex-col text-sm"
				initial="hidden"
				animate="visible"
				variants={listVariants}
			/>
		</div>
	);
}
