---
title: "Nodejs 从 CJS 迁移到 ESM"
date: "2024-11-26"
excerpt: "随着 Nodejs 对于 ESM 的支持逐渐完善，目前很多三方库也逐渐仅支持 ESM 模式"
tags: ["Nodejs", "cjs", "esm", "模块"]
---

随着 Nodejs 对于 ESM 的支持逐渐完善，目前很多三方库也逐渐仅支持 ESM 模式例如 `chalk`，眼看 CJS 已经渐渐沦为“昨日黄花”。

最近在准备升级之前开发的脚手架 simo-cli 的时候感觉尤为明显，很多库不能升级只能使用老版本，这迫使我要么放弃升级，要么全面拥抱 ESM。

那么如何优雅的从 CJS 过渡到 ESM 呢？以下逐一介绍：

## 常规替换

### 1、升级 `nodejs`最小版本到 18+;

### 2、在项目的 `package.json`中设置 `type: "module"`;

### 3、替换掉 `exports: "./index.js"` 使用 `main:"./index.js"`;

### 4、替换掉代码中的`require()/module.exports`换成`import/export`;

```javascript
/ CJS
const chalk = require('chalk');

// ESM
import chalk from 'chalk';
```

### 5、动态加载模块，可以使用 `import()` 函数;

```javascript
// CJS
const module = require("./dynamicModule");

// ESM
import("./dynamicModule").then((module) => {
  // 使用 module
});
```

### 6、使用 `nodejs`内置模块

```javascript
import fs from "node:fs";
```

### 7、`__dirname` 和 `__filename`的替代方案

```javascript
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### 8、导入`json`文件

```javascript
// CJS
const packageJson = require("./package.json");
// ESM
import packageJson from './package.json' with {type: 'json'};
```

### 9、不能省略'.js' 文件后缀

确保` js` 或者 `mjs` 文件后缀都存在

```javascript
import util from "util.js";
```

## 使用 Typescript 输出 ESM

### 1、使用 typescript 最低版本至少是 4.7

### 2、`engines`设置 `"node": ">=18"`

### 3、tsconfig.json 设置 `module`、`moduleResolution`、`esModuleInterop`

`module`主要影响编译后的输出格式，即模块代码是如何被组织和表示的。它决定了最终生成的 JavaScript 文件中模块的导入导出方式。

`moduleResolution`则专注于模块解析过程本身，即 TypeScript 在编译期间如何找到并加载指定的模块。它不会改变生成的代码格式，而是影响了 TypeScript 编译器内部的工作流程。

`esModuleInterop`：允许你在 ESM 和 CommonJS 模块之间进行互操作;

```json
{
  "module": "nodenext",
  "moduleResolution": "nodenext"
}
```

4、确保构建完成后的模块引入保留 `.js`后缀

```javascript
// ts
import { someFunction } from "./utils";

// js
import { someFunction } from "./utils.js";
```

模块之间可以使用路径别名，但是构建之后的代码在 node 环境中执行必须包含完整的带有`.js`后缀的路径；

需要使用 `rollup`、`webpack`进行构建，或者使用 `tsc`构建完成后，再编写脚本把 `.js`后缀在代码中加上；
