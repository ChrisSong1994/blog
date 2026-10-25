/**
 * 全局类型（无 import/export，因此是 ambient 声明，可直接使用无需 import）。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIfEmpty = any;

interface ProjectItem {
	id?: string;
	name?: string;
	url?: string;
	description?: string;
	/** public/ 下的图片路径，例如 '/projects/navigator.svg' */
	icon?: string;
	tags?: string[];
}
