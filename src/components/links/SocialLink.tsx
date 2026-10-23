'use client';

import { type IconProps } from '@/assets';
import * as iconList from '@/assets/index';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { copyTextToClipboard } from '@/lib';
import { withBasePath } from '@/lib/base-path';
import { makeBlurDataURL } from '@/lib/images';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import React, { type FC } from 'react';
import siteMetadata from '@/config/site';

type IconName = keyof typeof iconList;

type TypeSocialLinkProps = {
	platform?: Platform | string;
	icon?: string;
	isPicture?: boolean;
} & LinkProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

const IconComponents: Record<
	IconName,
	React.ComponentType<IconProps>
> = iconList;

type Platform =
	| 'github'
	| 'twitter'
	| 'youtube'
	| 'telegram'
	| 'bilibili'
	| 'mail'
	| 'rss'
	| '微信'
	| '微信公众号';

/**
 * 二维码弹窗：`href` 是 public/media 下的文件名（不含扩展名）。
 * 换成自己的二维码时直接覆盖同名文件即可，不需要改代码。
 */
const PictureDialog = ({
	platform,
	href,
	children
}: {
	platform?: Platform | string;
	href: string;
	children: React.ReactNode;
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="px-10 py-10 sm:max-w-[425px]">
				<div className="relative h-auto w-34">
					<Image
						src={withBasePath(`/media/${href}.png`)}
						alt={platform ?? siteMetadata.authorsCN}
						width={430}
						height={430}
						unoptimized
						placeholder="blur"
						blurDataURL={makeBlurDataURL(16, 16)}
						style={{ width: '100%', height: 'auto' }}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const LinkHrefWrapper: FC<TypeSocialLinkProps> = ({
	platform,
	href,
	children,
	...props
}) => {
	// 邮箱这类没有可跳转页面的平台，点击即复制
	const textList = ['邮箱'];
	const isText = textList.includes(platform ?? '');
	return isText ? (
		<span
			onTouchEnd={() => copyTextToClipboard(href)}
			onClick={() => copyTextToClipboard(href)}
		>
			{children}
		</span>
	) : (
		<Link
			href={href}
			target="_blank"
			prefetch={false}
			aria-label={platform}
			{...props}
		>
			{children}
		</Link>
	);
};

export function SocialLink({
	platform,
	href,
	isPicture,
	icon,
	...props
}: TypeSocialLinkProps) {
	const Icon = IconComponents[icon as IconName];

	if (!Icon) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					{isPicture ? (
						<PictureDialog platform={platform} href={href}>
							<Icon className="text-2xl text-zinc-400 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
						</PictureDialog>
					) : (
						<LinkHrefWrapper platform={platform} href={href} {...props}>
							<Icon className="text-2xl text-zinc-400 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
						</LinkHrefWrapper>
					)}
				</TooltipTrigger>
				<AnimatePresence>
					<TooltipPortal>
						<TooltipContent>
							<motion.div
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
							>
								{platform}
							</motion.div>
						</TooltipContent>
					</TooltipPortal>
				</AnimatePresence>
			</Tooltip>
		</TooltipProvider>
	);
}
