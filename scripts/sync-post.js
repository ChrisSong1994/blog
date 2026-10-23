/**
 * 同步脚本入口：pnpm sync-post
 */
const syncPost = require('./github/syncPost');

syncPost().catch((error) => {
	console.error(error);
	process.exit(1);
});
