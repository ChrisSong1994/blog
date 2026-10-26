'use client';

import { ClipboardCheckIcon, ClipboardDataIcon } from '@/assets';
import { copyTextToClipboard } from '@/lib';
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

/**
 * MDX 里的代码块。
 *
 * rehype-prism-plus 会把每一行包成 `<span class="code-line">`，换行符留在 span
 * 内部，所以直接读 `<pre>` 的 `textContent` 就是完整源码（末尾多一个换行）。
 *
 * `className`（`language-xxx`）必须原样透传到 `<pre>` 上：两个 prism 主题文件
 * 都是靠 `pre[class*='language-']` 选中的，丢掉它代码块就完全没有样式了。
 */
export default function CodeBlock({
	children,
	...props
}: ComponentPropsWithoutRef<'pre'>) {
	const preRef = useRef<HTMLPreElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	function handleCopy() {
		// 只掐掉 prism 留在末尾的那一个换行，不动代码里其它的空白
		const code = (preRef.current?.textContent ?? '').replace(/\n$/, '');
		copyTextToClipboard(code);

		setCopied(true);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="group relative my-4">
			<pre ref={preRef} {...props}>
				{children}
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				aria-label="复制代码"
				className="absolute top-2.5 right-2.5 flex size-7 cursor-pointer items-center justify-center rounded-md border border-border/70 bg-surface/80 text-muted-foreground opacity-0 backdrop-blur transition hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
			>
				{copied ? (
					<ClipboardCheckIcon className="h-3.5 w-3.5" />
				) : (
					<ClipboardDataIcon className="h-3.5 w-3.5" />
				)}
			</button>
		</div>
	);
}
