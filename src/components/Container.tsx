import { cn } from '@/lib/utils';
import React from 'react';

type ContainerProps = React.ComponentPropsWithoutRef<'div'> & {
	/**
	 * 内层（负责居中 + 限宽）那层 div 的额外类名。
	 * 默认 Outer 是 `max-w-7xl`、Inner 是 `max-w-2xl lg:max-w-5xl`，
	 * 需要更宽的内容区时用 `lg:max-w-none` 之类覆盖。
	 */
	innerClassName?: string;
};

const OuterContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
	function OuterContainer(
		{ className, innerClassName, children, ...props },
		ref
	) {
		return (
			<div ref={ref} className={cn('sm:px-8', className)} {...props}>
				<div className={cn('mx-auto max-w-7xl lg:px-8', innerClassName)}>
					{children}
				</div>
			</div>
		);
	}
);

const InnerContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
	function InnerContainer(
		{ className, innerClassName, children, ...props }: ContainerProps,
		ref
	) {
		return (
			<div
				ref={ref}
				className={cn('relative px-4 sm:px-8 lg:px-12', className)}
				{...props}
			>
				<div className={cn('mx-auto max-w-2xl lg:max-w-5xl', innerClassName)}>
					{children}
				</div>
			</div>
		);
	}
);

const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(
	function Container(
		{ children, innerClassName, ...props }: ContainerProps,
		ref
	) {
		return (
			<OuterContainer ref={ref} innerClassName={innerClassName} {...props}>
				<InnerContainer innerClassName={innerClassName}>
					{children}
				</InnerContainer>
			</OuterContainer>
		);
	}
);

/**
 * 基础布局组件。Container.Outer / Container.Inner 可单独使用。
 */
export const Container = Object.assign(ContainerComponent, {
	Outer: OuterContainer,
	Inner: InnerContainer
});
