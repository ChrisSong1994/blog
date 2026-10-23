'use client';

import { useIsMounted } from '@/hooks/useIsMounted';
import * as React from 'react';

/** 只在客户端渲染 children，避免 SSR 与挂载后 DOM 不一致 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
	const isMounted = useIsMounted();

	return <>{isMounted ? children : null}</>;
}
