---
title: "图片懒加载 IntersectionObserver"
date: "2021-07-14"
excerpt: 图片懒加载是一种`性能优化`手段，在很多以图文列表为主的场景使用较多，比如大部分的首页商品列表展示
tags: ["性能优化","javascript"]
---


图片懒加载是一种`性能优化`手段，在很多以图文列表为主的场景使用较多，比如大部分的首页商品列表展示，由于首页渲染需要静态资源加载，数据请求，数据渲染三个过程，且首页的加载时间直接影响其**用户体验**，所有在首页中做好性能优化尤其重要。
### 原理
图片懒加载可以在首页性能优化中起到减少并发请求的作用，即，不在可视区的图片可以先不请求资源，等到下拉到一定距离或者进入可视区再请求静态资源，其原理就是：监听图片是否处于可视区位置，来判断是否发起资源请求；
![image.png](/images/e37e0c49185d18cda775fbb3f38dff79.png)
### 实现方案
图片懒加载的方案有两种：
1、监听滚动事件，调用 `img`的 `getBoundingClientRect`方法返回图片标签的位置数据，根据位置判断是否在可视区；
具体代码如下
```javascript
const lazyImages = [...document.querySelectorAll(".img-box > .lazy")];
const winHeight = window.innerHeight;

onScroll();
window.onscroll = onScroll;
function onScroll(){
  for (let i = 0; i < lazyImages.length; i++) {
    const lazyImage = lazyImages[i];
    if(lazyImage.getBoundingClientRect().top < winHeight){
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
    }
  }
}
```
2、使用`IntersectionObserver`创建一个监听器，订阅`img`标签，当图片位置变化，可以通过监听事件拿到变化的实例对象，根据实例对象的属性`isIntersecting`可以判断是否进入可视区；具体代码如下
```javascript
const lazyImages = [...document.querySelectorAll(".img-box > .lazy")];
let lazyImageObserver = new IntersectionObserver(function (
  entries
) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      let lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
      lazyImageObserver.unobserve(lazyImage);
    }
  });
});

lazyImages.forEach(function (lazyImage) {
  lazyImageObserver.observe(lazyImage);
});
```
创建 `IntersectionObserver`实例时候可以穿入`options`参数包含
- `root`: 被当作视口元素，默认是根元素；
- `rootMargin`:一个在计算交叉值时添加至根的边界盒中的一组偏移量，类型为字符串 (string) ，可以有效的缩小或扩大根的判定范围从而满足计算需要。语法大致和 CSS 中的margin 属性等同;
- `threshold`:规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组 0.0 到 1.0 之间的数组
### 参考

- [https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver)
