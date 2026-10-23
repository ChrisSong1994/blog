/**
 * 将给定的值限制在 [a, b] 区间内。
 */
export function clamp(value: number, a: number, b: number) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);
	return Math.min(Math.max(value, min), max);
}
