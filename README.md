# blog

一个用 **Next.js 16 + Tailwind CSS 4** 搭建的静态个人博客。文章可以从 **GitHub Issues**
自动同步过来，也可以直接在仓库里手写 MDX。

架构与交互参考了 [other-blog](https://github.com/coderPerseus/blog)（Next 14 +
Contentlayer 版本），技术栈升级到了当前脚手架的版本：

| 关注点     | 参考项目                  | 本项目                               |
| ---------- | ------------------------- | ------------------------------------ |
| 框架       | Next.js 14.2（webpack）   | **Next.js 16.4（Turbopack）**        |
| React      | 18                        | **19**                               |
| 样式       | Tailwind CSS 3（JS 配置） | **Tailwind CSS 4（CSS-first 配置）** |
| MDX 内容层 | Contentlayer（已停更）    | **Content Collections**              |
| 动画       | framer-motion             | **motion**（v14，`motion/react`）    |
| 输出       | `output: 'export'`        | 同左（`out/`）                       |

## 特性

- **静态导出**：`pnpm build` 产出 `out/`，可直接丢到 GitHub Pages / Vercel / 任意静态托管
- **GitHub Issues 同步**：在 Issue 仓库里新建 / 编辑 Issue，Actions 自动同步成文章并提交回仓库
- **双内容源**：`posts/` 手写页面（about 等）+ `data/blog/` 由 Action 生成，共用同一套 schema
- **文章体验**：标签、封面、阅读时长、右侧目录（tocbot）、代码高亮、图片点击放大
- **列表搜索**：`/posts` 按年份分组，支持按标题 / 标签 / 简介即时筛选
- **主题切换**：亮暗主题 + View Transition 过渡，代码高亮样式随主题切换
- **SEO**：`metadata` 模板、Open Graph、sitemap、robots、RSS（构建时生成 `feed.xml`）
- **工程化**：ESLint 9（flat config）+ Prettier + husky + lint-staged + commitlint

## 快速开始

```bash
pnpm install
cp .env.example .env.local     # 按需修改里面的值
pnpm dev                       # http://localhost:3000
```

构建静态站点：

```bash
pnpm build                     # 产出 out/
pnpm start:static              # 本地预览 out/（http://localhost:3003）
```

## 目录结构

```
.
├── content-collections.ts       # 内容层：schema + remark/rehype 管线
├── site.config.json             # 站点名称/简介/作者（构建脚本也要读的字段）
├── posts/                       # 手写文章（带 NN- 序号前缀）与 about 等页面
│   └── images/                  # 文章配图，按文章序号分目录，构建时同步到 public/
├── data/blog/                   # GitHub Issues 同步生成的文章（由 Action 维护）
├── public/                      # 静态资源：logo、og、二维码、prism 样式、feed.xml
├── scripts/
│   ├── github/syncPost.js       # Issues → data/blog/*.mdx
│   ├── sync-post.js             # ↑ 的入口
│   ├── generate-rss.js          # 构建前生成 public/feed.xml
│   └── copy-post-images.js      # 构建前把 posts/images/ 同步到 public/
├── src/
│   ├── app/
│   │   ├── (app)/               # 带顶栏/页脚的页面
│   │   │   ├── page.tsx         # 首页
│   │   │   ├── posts/           # 列表 + [id] 详情
│   │   │   ├── projects/        # 项目
│   │   │   ├── about/           # 关于我（渲染 posts/about.mdx）
│   │   │   └── icon/            # 图标总览（调试用）
│   │   ├── layout.tsx           # 根布局：主题、统计、字体
│   │   ├── sitemap.ts / robots.ts
│   │   └── not-found.tsx
│   ├── assets/                  # 内联 SVG 图标、404 插画
│   ├── components/              # Header / Footer / NavigationBar / MDX 组件 …
│   ├── config/site.ts           # ★ 站点配置唯一入口
│   ├── lib/posts.ts             # 文章查询（列表、详情、上下篇）
│   └── style/tocbot.css
└── .github/workflows/
    ├── sync-post.yml            # Issues → 文章
    └── deploy.yml               # 构建并发布到 GitHub Pages（可选）
```

## 个性化

### 1. 站点信息

改两个地方，都有 `TODO` 标记：

- **`site.config.json`** —— `name`（站点名）、`description`（简介，同时用于 SEO 与 RSS）、
  `authors` / `authorsCN`（英文名 / 中文名）、`email`、`url`（兜底域名）、`locale`
- **`src/config/site.ts`** —— 导航项、社交链接、关键词、备案号、源码仓库地址等

> `site.config.json` 之所以独立出来，是因为 `scripts/generate-rss.js` 是 Node 脚本，
> 没法 import TS 配置。抽成 JSON 让「站点名」只有一处定义。

### 2. 图片占位

仓库里的图片基本都是程序生成的灰底占位图，换成自己的即可（**保持文件名不变就不用改代码**）。
`logo.png` / `logo-alt.png` / `favicon.ico` 这三处已经换成站长的头像，就不用再动了；
`logo.png` 同时被 `site.webmanifest` 和 `metadata` 引用，所以格式固定是 256×256 的 PNG：

| 文件                        | 用途                                                   |
| --------------------------- | ------------------------------------------------------ |
| `public/logo.png`           | 头像 / logo，也是 webmanifest 图标（256×256 PNG）      |
| `public/logo-alt.png`       | 备用头像，右键头像可切换（256×256）                    |
| `public/og.png`             | 社交分享预览图（建议 1200×630）                        |
| `public/media/*.png`        | 微信 / 公众号 / 抖音 / QQ 二维码（430×430）            |
| `public/projects/*.png`     | 项目卡片图标（128×128）                                |
| `public/police.png`         | 备案图标（只有填了 `beian` 才显示）                    |
| `src/app/favicon.ico`       | 站点图标，由 `metadata.icons` 与 Next 文件约定自动下发 |
| `src/assets/unDraw/404.svg` | 404 页插画                                             |

### 3. 项目列表

改 `src/app/(app)/projects/Projects.tsx` 里的数组，图标用 `public/projects/` 下的路径。

### 4. 导航与「更多」下拉

`src/config/site.ts` 的 `navigationItems`；带 `menu: true` 的项会渲染成下拉，
子项在 `moreItems` 里按 `href` 分组。

## 从 GitHub Issues 发文章

### 准备

1. 建一个**专门用来存文章**的 Issues 仓库（可以和博客仓库是同一个）
2. 在博客仓库里加三个 Secrets（Settings → Secrets and variables → Actions）：

   | Secret            | 说明                               |
   | ----------------- | ---------------------------------- |
   | `GH_TOKEN`        | 有 `repo` 权限的 PAT，用于读 Issue |
   | `GH_USER`         | 拥有那个 Issues 仓库的用户名       |
   | `GH_PROJECT_NAME` | Issues 仓库名                      |

3. 可选：加一个 `GH_CREATORS` Secret（逗号分隔）来允许多人同步。
   不配的话只有 `GH_USER` 本人的 Issue 会被同步，**别人提的 Issue 不会进博客**。

### 使用

在 Issues 仓库里新建 Issue：

- **标题** → 文章标题
- **标签** → 文章标签
- **正文** → 文章内容（支持 Markdown，也可以写 HTML，但标签必须闭合）

保存后 Actions 会自动跑，生成 `data/blog/<issue号>-<标题>.mdx` 并提交回仓库，
触发一次部署。编辑、打标签、关闭 Issue 都会重新同步。

文件名格式是 `<issue 号>-<标题>`，比如 Issue #8「雨雀图床问题」会生成
`data/blog/8-雨雀图床问题.mdx`：序号在前方便在目录里按 Issue 顺序排，也不会重名。
标题里的 `/ : * ? " < > |` 等非法字符会换成空格，超长标题会截断到 60 个字符。

**URL 固定为 `/posts/post-<号>`**，跟文件名和标题无关，所以改标题不会让已发布的链接失效。

**只有 open 的 Issue 才会被同步成文章**：关闭 Issue 就等于下线这篇文章，
下次同步时对应的文件会被删除，重新打开又会恢复。
Pull Request 不会被当作文章（GitHub 的 issues 接口也会返回 PR）。

本地想手动跑一次：

```bash
# .env.local 里填好 GH_TOKEN / GH_USER / GH_PROJECT_NAME
pnpm sync-post
```

> 同步脚本只清理自己生成的 `data/blog/<号>-*.mdx`（含旧的 `post-<号>.mdx`），
> 手工放进 `data/blog/` 的文件不会被删掉。

## 手写文章

在 `posts/` 下新建 `.mdx`（推荐，可用 JSX）或 `.md`（纯 Markdown）：

```mdx
---
title: 文章标题
slug: my-post # 最终地址 /posts/my-post
date: 2024-06-01
description: 一句话简介
tags: [前端, Next.js]
cover: /posts/images/01/cover.jpg # 可选，同样放 posts/images/<序号>/
---

正文…
```

两种后缀都能被收集，走同一条 MDX 编译管线。区别只有一点：`.md` 里不要写裸的
`<Button>` 这类标签（MDX 会当成组件标签解析，导致编译失败），需要时改用 `.mdx`
或把它们放进代码块 / 行内代码里。

`slug` 可以省略：不写时按文件名推导 —— 去掉 `01-` 序号前缀和扩展名，空格转
`-` 并转小写（中文保留），例如
`06-关于 WorkBuddy 对接线上 MCP 服务的一点思考.md` →
`/posts/关于-workbuddy-对接线上-mcp-服务的一点思考`。想让 URL 更好看就显式写 `slug`。

`posts/about.mdx` 是「关于我」页面的内容，改它就能改 `/about`。
`posts/welcome.mdx` 只是示例文章，不需要可以直接删。

### 文件名与配图

文章文件名带 `NN-` 序号前缀，按发布日期升序排列（`01-` 最早），方便在目录里排序：

```
posts/
├── 01-intersection-observer-lazy-load.mdx
├── 02-react-virtual-dom-reconciliation-fiber.mdx
├── 06-workbuddy-mcp.md    # .md 也可以
├── images/                # 配图源文件，按文章序号分目录
│   ├── 01/e37e0c49185d18cda775fbb3f38dff79.png
│   └── 02/9a9fc72ea38e93c66b92fd5b2ba90584.png
├── about.mdx              # 这类页面不加序号
└── welcome.mdx
```

配图放在 `posts/images/<序号>/` 下（跟文章序号对应），正文里按
`/posts/images/<序号>/图片名` 引用：

```mdx
![示意图](/posts/images/01/e37e0c49185d18cda775fbb3f38dff79.png)
```

`pnpm dev` 和 `pnpm build` 前会跑 `scripts/copy-post-images.js`，把整个
`posts/images/` 同步到 `public/posts/images/`（该产物不进仓库），所以源文件只维护一份。

> 序号只影响文件名排序：URL 由 frontmatter 里的 `slug` 决定，没写时按去掉序号前缀的文件名推导。

## 环境变量

| 变量                                    | 必填 | 说明                                               |
| --------------------------------------- | ---- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                  | 是   | 线上域名，用于 canonical / sitemap / RSS           |
| `NEXT_PUBLIC_SITE_EMAIL_FROM`           | 是   | 邮件相关（占位即可）                               |
| `NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED` | 否   | 外链悬浮预览，依赖服务端接口，纯静态请保持 `false` |
| `NEXT_PUBLIC_GOOGLE_ID`                 | 否   | Google Analytics 4                                 |
| `NEXT_PUBLIC_BAIDU_TONGJI`              | 否   | 百度统计                                           |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION`       | 否   | Google 站长验证                                    |
| `NEXT_PUBLIC_BAIDU_VERIFICATION`        | 否   | 百度站长验证                                       |

`env.mjs` 在构建时会用 zod 校验，缺必填项会直接报错（想跳过可以设 `SKIP_ENV_VALIDATION=true`）。

## 被 `.gitignore` 排除的东西

除了常规的 `node_modules` / `.next` / `out`，还有几个需要说明：

| 路径                    | 为什么                                         |
| ----------------------- | ---------------------------------------------- |
| `.env*`                 | 只提交 `.env.example` 模板，真实值不进仓库     |
| `.npmrc`                | 常放本地镜像源等机器相关配置，CI 用官方源即可  |
| `public/feed.xml`       | `prebuild` 时由 `scripts/generate-rss.js` 生成 |
| `public/posts/images/`  | `prebuild` 时从 `posts/images/` 同步过来       |
| `.content-collections/` | 内容层的构建产物，每次 build 重新生成          |

## 部署

### GitHub Pages

仓库已带 `.github/workflows/deploy.yml`：

1. Settings → Pages → Source 选 **GitHub Actions**
2. `deploy.yml` 的 Build 步骤里配好 `NEXT_PUBLIC_SITE_URL`（你的 Pages 地址），
   以及 `NEXT_PUBLIC_BASE_PATH`（项目站点的子路径，比如 `/blog`）

项目站点的地址形如 `https://<用户名>.github.io/<仓库名>`，页面挂在子路径下，
所以构建时的 `NEXT_PUBLIC_BASE_PATH` 必须一起配上，比如 `/blog`，否则
`/_next/...`、`favicon.ico` 这些静态资源会按域名根去请求，全部 404。
这两个值要指向同一个地址（用户站点 `<用户名>.github.io` 仓库则都留空）。

不需要 Pages 的话直接删掉这个文件。

### 其他平台

`output: 'export'` 的产物在 `out/`，Vercel / Netlify / Cloudflare Pages 都能直接用。
注意在平台侧配好 `NEXT_PUBLIC_SITE_URL`。

## 常用命令

```bash
pnpm dev            # 开发
pnpm build          # 构建（会先生成 feed.xml）
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm sync-post      # 手动同步一次 Issues
pnpm generate-rss   # 只重新生成 feed.xml
pnpm start:static   # 本地预览构建产物
```

## 已知取舍

- **空博客也能构建**：一篇文章都没有时，`/posts/[id]` 会生成一个占位页并提示去发文章
  （`output: 'export'` 不允许 `generateStaticParams` 返回空数组）。
- **锚点链接**：文章里的 `<a href="https://...">` 不会自动带上外链样式，需要时用 Markdown 链接。
- **评论功能**：参考项目的评论是关掉的，这里也没接。需要的话可以接 giscus。
