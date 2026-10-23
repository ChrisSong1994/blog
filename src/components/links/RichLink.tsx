'use client';

import { ExternalLinkIcon, GitHubBrandIcon } from '@/assets';
import { cn } from '@/lib/utils';
import Link, { type LinkProps } from 'next/link';
import React from 'react';

/** 深色底需要反色的站点图标（用内置图标替代打包位图，省一份资源） */
const invertedFaviconHosts = new Set(['github.com']);

type RichLinkProps = LinkProps &
	React.ComponentPropsWithoutRef<'a'> & {
		children: React.ReactNode;
	} & {
		favicon?: boolean;
	};

export const RichLink = React.forwardRef<HTMLAnchorElement, RichLinkProps>(
	({ children, href, favicon = true, className, ...props }, ref) => {
		// 站内相对链接直接退化成普通 Link
		if (!href.startsWith('http')) {
			return (
				<Link href={href} className={className} ref={ref} {...props}>
					{children}
				</Link>
			);
		}

		const hrefHost = new URL(href).host;
		const hasFavicon = favicon && invertedFaviconHosts.has(hrefHost);

		return (
			<Link
				ref={ref}
				href={href}
				className={cn(
					'inline-flex place-items-baseline items-baseline gap-0.5 pr-0.5 text-[0.95em] leading-none',
					className
				)}
				rel="noopener noreferrer"
				target="_blank"
				{...props}
			>
				{hasFavicon && (
					<span
						className={cn(
							'mr-px inline-flex translate-y-0.5',
							invertedFaviconHosts.has(hrefHost) && 'dark:invert'
						)}
					>
						<GitHubBrandIcon
							aria-hidden="true"
							className="inline h-4 w-4 rounded"
						/>
					</span>
				)}
				{children}
				{favicon && (
					<ExternalLinkIcon
						width="0.95em"
						height="0.95em"
						className="inline-block translate-y-0.5"
						aria-hidden="true"
					/>
				)}
			</Link>
		);
	}
);
RichLink.displayName = 'RichLink';
