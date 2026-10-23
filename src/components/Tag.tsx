'use client';

import { cn } from '@/lib/utils';
import { type FC, type HTMLAttributes } from 'react';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'outline';
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Tag: FC<TagProps> = ({ children, className, ...props }) => {
	return (
		<div
			className={cn(
				'inline-flex items-center rounded-md bg-violet-200 px-3 text-xs font-medium text-violet-500 hover:bg-purple-500 hover:text-violet-900 dark:bg-violet-300 dark:text-violet-700',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Tag;
