'use client';

import siteMetadata from '@/config/site';
import Link from 'next/link';
import React from 'react';import { Avatar } from './Avatar';
import { NavigationBar } from './NavigationBar';
import ThemeToggle from './ThemeToggle';

/**
 * 顶栏：左侧站点标识，右侧导航与主题切换。
 * 只做一层细线分隔，滚动时半透明吸顶，保持阅读时始终可用的导航。
 */
export function Header() {
	// 右键头像切换备用头像，属于一个不打扰的小彩蛋
	const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false);
	const onAvatarContextMenu = React.useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			event.preventDefault();
			setIsShowingAltAvatar((prev) => !prev);
		},
		[]
	);

	return (
		<header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
				<div className="group flex shrink-0 items-center gap-3">
					<span onContextMenu={onAvatarContextMenu} className="inline-flex">
						<Avatar>
							<Avatar.Image alt={isShowingAltAvatar} />
						</Avatar>
					</span>
					<Link
						href="/"
						aria-label="返回首页"
						className="flex flex-col leading-none"
					>
						<span className="text-[15px] font-semibold tracking-tight text-foreground">
							{siteMetadata.authorsCN}
						</span>
						<span className="mt-1.5 hidden font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase sm:block">
							Writing &amp; Code
						</span>
					</Link>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<NavigationBar.Desktop />
					<span
						aria-hidden="true"
						className="hidden h-4 w-px bg-border md:block"
					/>
					<ThemeToggle />
					<NavigationBar.Mobile />
				</div>
			</div>
		</header>
	);
}
