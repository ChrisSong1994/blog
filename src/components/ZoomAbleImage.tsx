'use client';

import { ClientOnly } from '@/components/ClientOnly';
import Image from 'next/image';
import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ZoomAbleImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
}

/**
 * MDX 里的 <img> 统一走这个组件：静态导出下必须 unoptimized，
 * 点击后用 react-medium-image-zoom 放大查看。
 */
const ZoomAbleImage: React.FC<ZoomAbleImageProps> = ({
	src,
	alt,
	width,
	height
}) => {
	return (
		<ClientOnly>
			<Zoom>
				<Image
					unoptimized
					src={src}
					alt={alt}
					width={width || 800}
					height={height || 600}
				/>
			</Zoom>
		</ClientOnly>
	);
};

export default ZoomAbleImage;
