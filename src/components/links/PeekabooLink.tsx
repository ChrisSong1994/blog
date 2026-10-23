'use client';

import { RichLink } from '@/components/links/RichLink';
import {
	HoverCard,
	HoverCardContent,
	HoverCardPortal,
	HoverCardTrigger
} from '@/components/ui/hover-card';
import { makeBlurDataURL } from '@/lib/images';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import React from 'react';
import { env } from '~/env.mjs';

type PeekabooLinkProps = LinkProps &
	React.ComponentPropsWithoutRef<'a'> & {
		children: React.ReactNode;
	};

/**
 * 外链。开启 NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED 后悬停会拉取链接预览图
 * （该功能依赖服务端 `/api/link-preview`，纯静态导出请保持关闭）。
 */
export function PeekabooLink({
	href,
	children,
	className,
	...props
}: PeekabooLinkProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	// 站内相对链接退化成普通 Link
	if (!href.startsWith('http')) {
		return (
			<Link href={href} className={cn(className)} {...props}>
				{children}
			</Link>
		);
	}

	if (!env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED) {
		return (
			<RichLink
				href={href}
				className={cn(
					'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
					className
				)}
				target="_blank"
				{...props}
			>
				{children}
			</RichLink>
		);
	}

	return (
		<HoverCard
			openDelay={0}
			closeDelay={50}
			onOpenChange={(open) => setIsOpen(open)}
		>
			<HoverCardTrigger asChild>
				<RichLink
					href={href}
					className={cn(
						'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
						className
					)}
					target="_blank"
					{...props}
				>
					{children}
				</RichLink>
			</HoverCardTrigger>
			<AnimatePresence mode="wait">
				{isOpen && (
					<HoverCardPortal forceMount>
						<HoverCardContent asChild collisionPadding={250}>
							<motion.div
								className="pointer-events-none relative z-50 w-[400px] origin-top overflow-hidden !p-0"
								initial={{ opacity: 0, scale: 0.965, y: 9, height: 0 }}
								animate={{ opacity: 1, scale: 1, y: 0, height: 250 }}
								exit={{ opacity: 0, scale: 0.98, y: 8, height: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Image
									src={`/api/link-preview?url=${href}`}
									alt={`${href} 的预览图`}
									className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl object-cover"
									placeholder="blur"
									blurDataURL={makeBlurDataURL(16, 16)}
									width={400}
									height={250}
									unoptimized
								/>
							</motion.div>
						</HoverCardContent>
					</HoverCardPortal>
				)}
			</AnimatePresence>
		</HoverCard>
	);
}
