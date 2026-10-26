import { withBasePath } from '@/lib/base-path';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import { type PropsWithChildren } from 'react';

type ComponentProps<P = object> = PropsWithChildren<
	{
		className?: string;
	} & P
>;

// next/image 不会自动补 basePath
const LOGO_SRC = withBasePath('/logo.png');
const LOGO_ALT_SRC = withBasePath('/logo-alt.png');

function AvatarContainer({ className, ...props }: ComponentProps) {
	return (
		<div
			className={cn(
				className,
				'size-8 shrink-0 overflow-hidden rounded-full border border-border bg-surface p-[1.5px] transition-colors group-hover:border-brand/50'
			)}
			{...props}
		/>
	);
}

type AvatarImageProps = ComponentProps &
	Omit<LinkProps, 'href'> & {
		large?: boolean;
		href?: string;
		/** true 时展示备用头像（右键头像可切换） */
		alt?: boolean;
	};

function AvatarImage({
	large = false,
	className,
	href,
	alt,
	...props
}: AvatarImageProps) {
	return (
		<Link
			aria-label="主页"
			className={cn('block h-full w-full', className)}
			href={href ?? '/'}
			{...props}
		>
			<Image
				src={alt ? LOGO_ALT_SRC : LOGO_SRC}
				alt=""
				sizes={large ? '4rem' : '2rem'}
				className="h-full w-full rounded-full object-cover"
				width={large ? 64 : 32}
				height={large ? 64 : 32}
				unoptimized
			/>
		</Link>
	);
}

export const Avatar = Object.assign(AvatarContainer, { Image: AvatarImage });
