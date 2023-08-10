const path = require("path");
const chokidar = require("chokidar");
const parser = require("yargs-parser");
const fs = require("fs-extra");
const CP = require("child_process");
const signale = require("signale");

const MarkdownImageToBase64 = require("./mitb");

const originalBlogsDir = path.join(__dirname, "../_posts/blogs");
const convertedBlogsDir = path.join(__dirname, "../_posts/.blogs");

fs.ensureDirSync(convertedBlogsDir);

const args = parser(process.argv.slice(2));

async function run() {
  // 监听
  if (args.watch || args.w) {
    const converterMap = new Map(); // 存放转换实例
    const watcher = chokidar.watch(originalBlogsDir, {
      persistent: true,
    });

    watcher
      .on("add", (filepath) => {
        const basename = path.basename(filepath);
        const mitb = new MarkdownImageToBase64({
          input: filepath,
          output: path.join(convertedBlogsDir, basename),
          filter: /.*cdn\.nlark\.com.*/,
        });
        mitb.run();
        converterMap.set(filepath, mitb);
      })
      .on("change", (filepath) => {
        if (converterMap.get(filepath)) {
          converterMap.get(filepath).run();
        } else {
          const basename = path.basename(filepath);
          const mitb = new MarkdownImageToBase64({
            input: filepath,
            output: path.join(convertedBlogsDir, basename),
            filter: /.*cdn\.nlark\.com.*/,
          });
          mitb.run();
          converterMap.set(filepath, mitb);
        }
      });
  } else {
    const files = fs.readdirSync(originalBlogsDir);
    const queue = [];
    for (const filepath of files) {
      const basename = path.basename(filepath);
      queue.push(
        new MarkdownImageToBase64({
          input: path.join(originalBlogsDir, filepath),
          output: path.join(convertedBlogsDir, basename),
          filter: /.*cdn\.nlark\.com.*/,
        }).run()
      );
    }
    await Promise.all(queue);
    const child = CP.exec("next build");
    child.stdout.on("data", (data) => {
      signale.info("[next build]", data);
    });
  }
}

run();
