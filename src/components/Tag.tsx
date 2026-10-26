import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'outline';
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Tag = ({ children, className, ...props }: TagProps) => {
	return (
		<div
			className={cn(
				'inline-flex items-center rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] tracking-wide text-muted-foreground transition-colors group-hover:border-brand/30 group-hover:text-brand',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Tag;
