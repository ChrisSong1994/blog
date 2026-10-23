/**
 * 构建 / 开发前把 posts/images/ 同步到 public/posts/images/。
 *
 * 配图的源文件跟文章放在一起（posts/images/<文章序号>/），便于按文章归档，
 * 但 Next 只把 public/ 当静态目录，所以在这里复制一份出去，
 * 复制产物不进仓库（见 .gitignore），和 feed.xml 是同一个路子。
 */
const { promises: fs } = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'posts', 'images');
const TARGET_DIR = path.join(__dirname, '..', 'public', 'posts', 'images');

async function copyPostImages() {
	let entries;
	try {
		entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
	} catch {
		// 还没有配图目录时直接跳过（例如刚 clone 下来、或文章都不带图）
		return;
	}

	const dirs = entries.filter((entry) => entry.isDirectory());
	if (dirs.length === 0) return;

	// 整体重来一遍，避免删掉的图片留在 public/ 里
	await fs.rm(TARGET_DIR, { recursive: true, force: true });
	await fs.mkdir(TARGET_DIR, { recursive: true });

	let count = 0;
	for (const dir of dirs) {
		const from = path.join(SOURCE_DIR, dir.name);
		const to = path.join(TARGET_DIR, dir.name);
		await fs.cp(from, to, { recursive: true });
		count += (await fs.readdir(from)).length;
	}

	console.log(`✅ 已同步 ${count} 张文章配图到 public/posts/images/`);
}

module.exports = copyPostImages;

// 直接 `node scripts/copy-post-images.js` 时执行
if (require.main === module) {
	copyPostImages().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
