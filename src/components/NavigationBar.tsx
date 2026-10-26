'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import siteMetadata from '@/config/site';
import { stripBasePath } from '@/lib/base-path';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navigationItems = siteMetadata.navigationItems;

/** 文章详情页也算在「博客」这一项下 */
function isActive(href: string, pathname: string) {
	if (href === '/') return pathname === '/';
	return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
	href,
	text,
	active
}: {
	href: string;
	text: string;
	active: boolean;
}) {
	return (
		<Link
			href={href}
			prefetch
			target={href === '/feed.xml' ? '_blank' : undefined}
			className={cn(
				'relative inline-flex h-9 items-center px-3 text-[13px] tracking-wide transition-colors',
				active
					? 'text-foreground'
					: 'text-muted-foreground hover:text-foreground'
			)}
		>
			{text}
			{active && (
				<motion.span
					layoutId="nav-indicator"
					className="absolute inset-x-3 bottom-1 h-px bg-brand"
					transition={{ type: 'spring', stiffness: 380, damping: 32 }}
				/>
			)}
		</Link>
	);
}

function Desktop() {
	const pathname = stripBasePath(usePathname());

	return (
		<nav aria-label="主导航" className="hidden md:block">
			<ul className="flex items-center gap-0.5">
				{navigationItems.map(({ href, text }) => (
					<li key={href}>
						<NavLink
							href={href}
							text={text}
							active={isActive(href, pathname)}
						/>
					</li>
				))}
			</ul>
		</nav>
	);
}

function Mobile() {
	const [open, setOpen] = React.useState(false);
	const pathname = stripBasePath(usePathname());

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="打开导航"
					className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground md:hidden"
				>
					<Menu className="size-4" strokeWidth={1.6} aria-hidden="true" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={10}
				className="w-56 rounded-lg border-border/80 bg-popover p-2 shadow-lg"
			>
				<nav aria-label="移动端导航">
					<ul className="flex flex-col">
						{navigationItems.map(({ href, text }) => {
							const active = isActive(href, pathname);
							return (
								<li key={href}>
									<Link
										href={href}
										prefetch
										onClick={() => setOpen(false)}
										target={href === '/feed.xml' ? '_blank' : undefined}
										className={cn(
											'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
											active
												? 'bg-muted text-foreground'
												: 'text-muted-foreground hover:bg-muted hover:text-foreground'
										)}
									>
										{text}
										{active && (
											<span
												aria-hidden="true"
												className="size-1 rounded-full bg-brand"
											/>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</PopoverContent>
		</Popover>
	);
}

export const NavigationBar = {
	Desktop,
	Mobile
} as const;
