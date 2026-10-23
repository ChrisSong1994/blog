import * as React from 'react';
import CodeBlock from './CodeBlock';
import ZoomAbleImage from './ZoomAbleImage';

/** 递归判断一段 MDX 子节点里是否出现了图片 */
function containsImage(node: React.ReactNode): boolean {
	return React.Children.toArray(node).some((child) => {
		if (!React.isValidElement(child)) return false;
		if (child.type === ZoomAbleImage || child.type === 'img') return true;
		const { children } = child.props as { children?: React.ReactNode };
		return children ? containsImage(children) : false;
	});
}

/**
 * markdown 里单独成行的图片会被编译成 `<p><img/></p>`，而 ZoomAbleImage
 * 渲染出来的 react-medium-image-zoom 容器是 `<div>`，`<div>` 不能嵌在
 * `<p>` 里，否则 React 会报 hydration 错误。所以含图片的段落改成 `<div>`。
 */
function Paragraph({
	children,
	...props
}: React.ComponentPropsWithoutRef<'p'>) {
	if (containsImage(children)) {
		return <div {...props}>{children}</div>;
	}
	return <p {...props}>{children}</p>;
}

/**
 * 传给 MDXContent 的自定义组件表。
 * 其余标签走 `.markdown-body`（见 src/style/markdown.css）的默认样式。
 */
const MDXComponents = {
	img: ZoomAbleImage,
	p: Paragraph,
	pre: CodeBlock
};

export default MDXComponents;
