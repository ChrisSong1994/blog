---
title: 通过网站连接获取 favicon 图标
date: "2024-06-21"
excerpt: 如何通过网站连接获取 favicon 图标
tags: ["favicon","logo","url"]
---

最近在做一个小工具，是一个浏览器插件，初期设想满足自己自定义 new tab 的能力，例如常用的快捷键、支持多种搜索引擎，甚至页面小工具等等；
其中快捷连接需要能够自动根据输入的连接获取 favicon，这个很多工具都支持，例如雨雀的标题连接、微信钉钉的聊天窗分享等；
下面我简单介绍下如何通过网站连接获取 favicon 图标。

### 1、直接访问默认路径
许多网站将它们的 favicon 放置在一个固定的 URL 路径下，通常是 https://example.com/favicon.ico。可以尝试直接访问这个 URL 来获取 favicon。
但是，这种方法简单但不总是可靠，因为并非所有网站都将 favicon 放在默认路径上。

### 2、解析 HTML 文档中的 <link> 标签
更可靠的方法是从网页的 HTML 文档中查找 <link> 标签，这些标签通常指定了 favicon 的位置。你可以使用 HTTP 请求库（如 axios 或 node-fetch）来获取页面内容，并使用 DOMParser 或正则表达式来解析 HTML。
例如
```js
import axios from axios;
const { JSDOM } = require('jsdom');

async function getFaviconFromHtml(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const link = dom.window.document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (link && link.href) {
      return new URL(link.href, url).href; // 确保相对 URL 被转换为绝对 URL
    }
    return `${url}/favicon.ico`; // 如果没有找到 <link> 标签，则尝试默认路径
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
    return null;
  }
}

// 示例用法
getFaviconFromHtml('https://example.com').then(faviconUrl => {
  console.log('Favicon URL:', faviconUrl);
});
```