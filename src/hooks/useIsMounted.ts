import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * 判断当前是否已经跑在浏览器里。
 * 服务端快照固定为 false，客户端快照固定为 true，
 * 这样 SSR 与首次 hydration 的输出一致，不会报 hydration mismatch。
 */
export function useIsMounted() {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);
}
