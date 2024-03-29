const fetch = require("node-fetch");
const signale = require("signale");
const path = require("path");
const fs = require("fs-extra");
const crypto = require("crypto");

const cwd = process.cwd();

const imagesDir = path.join(__dirname, "../_posts/images"); //  存放图片到本地，构建的时候会同步到public
const publicImagesDir = path.join(__dirname, "../public/images");

fs.ensureDirSync(imagesDir);
fs.ensureDirSync(publicImagesDir);

/**
 * 获取 markdown 中的 image 标签
 * @param {string} input
 */
function parseMarkdownImagesUrls(input, filter) {
  const reg = /.*\!\[.*\]\((.*)\).*/g;
  const matchs = [...input.matchAll(reg)];
  let urls = matchs.map((m) => m[1]).filter((url) => url.startsWith("http")); // 过滤掉 base64 和 相对路径

  if (filter) {
    urls = urls.filter((url) => filter.test(url));
  }

  return urls;
}

/**
 * 图片下载转base64
 *  @param {string} url
 *  @param {number} quality // 图片压缩比
 */
async function imageUrlConvertToLocalPath(url) {
  const ext = path.parse(new URL(url).pathname).ext;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const hash = crypto.createHash("md5").update(buffer).digest("hex");
  const filename = `${hash}${ext}`;
  const filepath = path.join(imagesDir, filename);
  fs.ensureFileSync(filepath);
  await fs.writeFile(filepath, buffer);
  fs.copyFileSync(filepath, path.join(publicImagesDir, filename));
  return `../images/${filename}`;
}

/**
 * 参数
 * input 输入文件
 * output 输出文件
 * options
 * * quality 图片压缩比
 * * filter  正则匹配，默认匹配全部图片
 * 日志
 */
class MarkdownImageToLocalPath {
  constructor(props) {
    const { input, output, quality = 1, filter } = props;
    this.imgUrlMap = new Map(); // url 和 base64 对应
    this.inputPath = path.isAbsolute(input) ? input : path.join(cwd, input);
    this.outputPath = path.isAbsolute(output) ? output : path.join(cwd, output);
    this.quality = quality;
    this.filter = filter;
  }

  async run() {
    fs.ensureFileSync(this.outputPath);
    signale.info("开始处理");
    // 1、解析input 获取需要转换的图片地址,存放起来
    await this.parse();
    // 2、处理图片，下载、转换、存放
    await this.convert();
    // 3、替换图片资源，放入到output
    await this.generate();

    signale.complete("处理完成");
  }

  async parse() {
    signale.pending("图片地址解析...");
    this.input = await fs.readFile(this.inputPath, { encoding: "utf8" });
    const matchedUrls = parseMarkdownImagesUrls(this.input, this.filter);
    matchedUrls.forEach((url) => this.imgUrlMap.set(url, null));
  }

  async convert() {
    signale.pending("图片地址转换...");
    for (const url of this.imgUrlMap.keys()) {
      const base64 = await imageUrlConvertToLocalPath(url, this.quality);
      this.imgUrlMap.set(url, base64);
    }
  }

  async generate() {
    signale.pending("图片地址替换...");
    let output = this.input;
    for (const url of this.imgUrlMap.keys()) {
      const base64 = this.imgUrlMap.get(url);
      if (base64) {
        output = output.replaceAll(url, base64);
      }
    }
    await fs.writeFile(this.outputPath, output, { encoding: "utf8" });
  }
}

module.exports = MarkdownImageToLocalPath;
