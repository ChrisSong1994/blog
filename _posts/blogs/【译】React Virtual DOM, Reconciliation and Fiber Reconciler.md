---
title: "【译】React Virtual DOM, Reconciliation and Fiber Reconciler"
date: "2023-10-23"
excerpt: 这片文章，我们将讨论下 React Virtual DOM  和 Reconciliation 的工作原理 
tags: ["React"]
---

> 原文：[https://namansaxena-official.medium.com/react-virtual-dom-reconciliation-and-fiber-reconciler-cd33ceb0478e](https://namansaxena-official.medium.com/react-virtual-dom-reconciliation-and-fiber-reconciler-cd33ceb0478e)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/241994/1694152875856-4b0aae97-be14-466f-8c84-2b7d775c9b76.png#averageHue=%23222121&clientId=u944a1cf4-6a39-4&from=paste&height=432&id=u87cecf3c&originHeight=439&originWidth=675&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62335&status=done&style=none&taskId=u0a6c87aa-e0b2-4565-b273-787b1c1bfcb&title=&width=663.5)

这片文章，我们将讨论下 React Virtual DOM  和 Reconciliation 的工作原理 
## 介绍
在讨论 Virtual DOM 之前，我们需要先了解下浏览器渲染的过程和 DOM。<br />以下是浏览器渲染的几个步骤：
#### 解析 HTML：
浏览器解析 HTML 并将其作为文档的树状结构存储在内存中，这也称为 DOM (文档对象模型)，有时也称为真正的 DOM。它是一个用于构建网站的Web API。 DOM 提供一些方法对文档树进行编辑，可以更改文档的结构、样式或内容。
#### 解析 CSS：
浏览器解析 CSS 并将其作为 CSSOM (CSS对象模型)存储在内存中。它是一个Web API来操作我们网站的CSS。
#### 创建渲染树:
浏览器使用DOM和CSSOM来创建渲染树。渲染树表示将在浏览器上呈现的所有内容(HTML节点及其样式)。
#### 布局：
浏览器计算所有元素的几何形状(大小和定位)，并相应地开始放置它们。
#### 绘制：
开始根据元素样式绘制所有节点。
## Virtual DOM
Virtual DOM 是 DOM 作为 JavaScript 对象的表示。这是一个由JS库和框架实现的概念，以实现状态驱动的UI开发。其有助于React进行批处理状态更改并处理平滑的状态转换。<br />当讨论 React Virtual DOM 时，说它帮助React只重新渲染需要更新的浏览器DOM树的那些部分，这没错。但是，如果说使用原生 JS 做 DOM 操作总是导致重新渲染整个页面，这是不正确的。<br />我做了两个简单的时钟项目（一个用原生 JS 一个用 React）用于解释；<br />

![clock.gif](https://cdn.nlark.com/yuque/0/2023/gif/241994/1694155112819-fe2498e0-1f36-4331-944f-9a46371f556f.gif#averageHue=%23f7f7fd&clientId=u944a1cf4-6a39-4&from=ui&id=u95739489&originHeight=888&originWidth=1904&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4009827&status=done&style=none&taskId=uec19f6d2-0299-4880-a663-039b44658c0&title=)
<br />
原生 JS 源码: [https://github.com/Naman-Saxena1/clock-example-vanilla-js](https://github.com/Naman-Saxena1/clock-example-vanilla-js)<br />React 源码: [https://github.com/Naman-Saxena1/clock-example-react](https://github.com/Naman-Saxena1/clock-example-react)
## 为什么需要 Virtual DOM
当我们在React应用程序中进行任何状态更改时，它会创建一个包含最新版本的整个 Virtual DOM 树。然后React通过比较旧的 Virtual DOM 树和更新后的 Virtual DOM 树来找到需要更改的元素。然后只更新浏览器DOM中已更改的元素。React 使用 DIFF 算法来比较两个虚拟DOM树，我们将在后面的部分中讨论。<br />

![Real DOM and Virtual DOM](https://cdn.nlark.com/yuque/0/2023/png/241994/1694155382828-65d65194-d4a2-44da-8303-39c7a41cffcc.png#averageHue=%23fbfafa&clientId=u944a1cf4-6a39-4&from=paste&height=271&id=uc626e19c&originHeight=542&originWidth=1098&originalType=binary&ratio=2&rotation=0&showTitle=true&size=113275&status=done&style=none&taskId=u24541d35-f503-4e7d-b7d4-b5e0caf7e44&title=Real%20DOM%20and%20Virtual%20DOM&width=549 "Real DOM and Virtual DOM")

<br />
由于 React 为每个状态更改创建一个新的 UI , Virtual DOM 可以帮助 React 对新的 Virtual DOM 树进行更改不会立即触发回流和重新绘制，因为浏览器屏幕上没有绘制任何内容。<br />使用2棵 Virtual DOM 树的好处是，1棵树充当草稿和以后用于对真实DOM进行批量更新。旧的 Virtual DOM 树被称为 Current tree，另一个被称为 Work in Progress tree (因为它基本上被用作草稿)。在 [Dan Abramov 的Youtube 视频](https://www.youtube.com/watch?v=aS41Y_eyNrU) 中，他解释了2个虚拟DOM树的动机来自于早期用于游戏开发的双重缓冲技术。<br />所以React首先会修改working in Progress Tree，然后更新 Real DOM。它比使用原生 JS 编写的网站做了更多的额外工作。但就性能而言，它仍然足够好。

你可以相关文章：
- [How exactly is React’s Virtual DOM faster?](https://stackoverflow.com/questions/61245695/how-exactly-is-reacts-virtual-dom-faster/61272492?source=post_page-----cd33ceb0478e--------------------------------#61272492)
- [Virtual DOM is pure overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead?source=post_page-----cd33ceb0478e--------------------------------)

<br />我们使用 React 而不是原生 JS，因为它是声明式的，提供可重用组件，并有助于轻松构建复杂的UI，同时抽象掉困难的部分。 <br />另外，由于 Facebook、Netflix、Dropbox 等现代网站都是高度动态的，使用 Work in Progress tree 分批更新是有益的。<br />这就是为什么您可能已经注意到，如果您曾经做过类似下面示例的事情，setState()会批量更新，因为它是异步的。<br />

![image.png](https://cdn.nlark.com/yuque/0/2023/png/241994/1694156072970-1e29ca0f-2eff-4aaf-a3e3-d0b9225a0738.png#averageHue=%2323262f&clientId=u944a1cf4-6a39-4&from=paste&height=644&id=u465b1b17&originHeight=860&originWidth=965&originalType=binary&ratio=2&rotation=0&showTitle=false&size=227502&status=done&style=none&taskId=u7771dabf-0089-4b58-8b04-320e6033ef2&title=&width=722.5)

你可以阅读相关文章：
- [https://github.com/facebook/react/issues/11527#issuecomment-360199710](https://github.com/facebook/react/issues/11527#issuecomment-360199710)
## 重要的术语
为了更好地理解，我们需要在讨论整个和解过程之前讨论一些术语。<br />**Reconciliation** 是通过像 **ReactDOM** 这样的库保持2个 DOM 树同步的过程。这是通过使用 Reconciler 和 **Renderer** 完成的。<br />**Reconciler** 使用 DIFF 算法来查找当前树(Current Tree)和进行中树(Work in Progress Tree)之间的差异，并将计算后的更改发送给Renderer。<br />**Renderer** 是用来更新应用UI的。不同的设备在共享相同的 **Reconciler** 时可以有不同的 **Renderer**。<br />在 React 16 之前，React 使用调用堆栈来跟踪程序的执行。因此，旧的 **reconciler** 被称为 **Stack Reconciler**。这种方式的问题是，它是同步的，如果大量的执行同时发生。这可能会导致动画帧数下降和糟糕的UI体验。它曾经只有一个虚拟 DOM 树，这使得一些功能，如 **Suspense** 和 **Concurrent Mode** 无法实现，因为它们依赖于 Reconciler 的异步工作能力。<br />在 React 16中，他们从新开始创建了一个新的 **Reconciler**，它使用了一种叫做 fiber 的新数据结构。因此它被称为**Fiber Reconciler**。其主要目的是通过在优先级的基础上执行工作，使协调器异步化和智能化。<br />React Fiber需要利用协同调度来实现异步，并且能够做到:

1. 暂停工作，稍后再回来继续
2. 为不同类型的工作分配优先级
3. 重用以前完成的工作
4. 如果不再需要，就中止工作

fiber 是一个Javascript对象，它代表一个工作单元。对于每个React组件和元素，React 都创建自己的fiber object。它与实例有一对一的关系，并管理实例的工作。并且还跟踪它与 Virtual DOM 树中其他fiber object 的关系。<br />优先级列表:React Fiber为不同的更新赋予不同的重要性，并根据它们的优先级执行它们。

Priority List :
- 0 : No Work //No work is pending
- 1 : SynchronousPriority //For controlled text inputs. Synchronous side effects
- 2 : TaskPriority //Needs to complete at the end of the current tick
- 3 : AnimationPriority //Needs to complete before the next frame
- 4 : HighPriority //Interaction that needs to complete pretty soon to feel responsive
- 5 : LowPriority //Data fetching, or result from updating stores
- 6 : OffscreenPriority //Won't be visible but do the work in case it becomes visible
# Reconciliation 过程 
浏览器的主线程是用来用React创建 Working In Progress树，处理用户事件，重绘等。![During Phase 1](https://cdn.nlark.com/yuque/0/2023/png/241994/1694157210624-8417c4c9-058d-47db-9380-c99064fdf507.png#averageHue=%23fbfafa&clientId=u944a1cf4-6a39-4&from=paste&height=352&id=u6dbd51a5&originHeight=552&originWidth=1003&originalType=binary&ratio=2&rotation=0&showTitle=true&size=108901&status=done&style=none&taskId=u1ab40fc6-6539-4150-8c8e-d1f28eadbf0&title=During%20Phase%201&width=640.5 "During Phase 1")<br />让我们看看这一切是如何结合在一起的:

1. 当我们对状态进行更改时，React等待主线程空闲，然后开始在其上构建一个 **Working In Progress **(WIP) 树。
2. WIP 树是由 fiber 构建，树结构和代码中的组件结构是相匹配的。
3. 构建WIP 树和找出变化的部分的这个阶段（**render / reconciliation phase**）是异步的，如果主线程有其他工作要完成，可以暂停。在这种情况下，主线会程根据优先级列表中的优先级开始处理这些更新。一旦主线程再次空闲，它将在上次停止的地方继续构建WIP树。一旦主线程再次空闲，它将在上次停止的地方继续构建WIP树。
4. 第二阶段(**commit phase**)在整个WIP树完成后开始，这个阶段是同步的并且不能被打断。在这个阶段，React 将对 DOM 做一些修改。它会通过把交换 **Current Tree** 和 **Work In Progress Tree** 的指针，并渲染 fiber 到 DOM.
5. 完成指针交换后，新的 WIP树 可以用于未来的状态变更

![Swapped Current Tree and Work In Progress Tree Pointers](https://cdn.nlark.com/yuque/0/2023/png/241994/1694158276034-a9027e1a-21cc-46c8-9840-ab4c6870375b.png#averageHue=%23fbf9f9&clientId=u944a1cf4-6a39-4&from=paste&height=369&id=ub15a7065&originHeight=551&originWidth=1010&originalType=binary&ratio=2&rotation=0&showTitle=true&size=111492&status=done&style=none&taskId=ucaff4728-cb14-4834-b0f0-c1080a04179&title=Swapped%20Current%20Tree%20and%20Work%20In%20Progress%20Tree%20Pointers&width=676 "Swapped Current Tree and Work In Progress Tree Pointers")<br />既然我们对整个和解进程是如何运作的有了更高层次的了解，我们可以讨论一些重要的问题。

1. 在比较 Current Tree 和 Working In Progress Tree 期间，React 会标记出需要更改的 fiber。然后创建它们的 Effect List，稍后将用于在DOM中进行更改。
2. 每个 fiber 都有一个指向另一个树中的 fiber 的备用属性。在创建 WIP 树时，React 找出不需要更改的 fiber，并从Current Tree  中克隆它们。这有助于React重用工作。
3. DIFF 算法作用于以上两个步骤，让 React 尽可能高效。
4. 最先进的算法的复杂度为O(n3)，其中n是树中元素的数量，因此，React基于两个假设实现了启发式O(n)算法:
   1. 两个不同类型的元素会创建不同的树，不会做 DIFF ，只做简单的替换。
   2. 开发者可以通过一个key属性表示哪些子元素在渲染中不需要更新。
5. React Fiber 的用处：
   1. Error Boundaries
   2. Fragments
   3. Portals

如果你是一个想学习React并且正在寻找免费的好资源的人，我发现[Codevolution Youtube React Playlist](https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3)非常有帮助。<br />以下是我找的一些对学习 React Fiber 有帮助的资源：

1. Lin Clark React Conf 2017: [https://www.youtube.com/watch?v=ZCuYPiUIONs](https://www.youtube.com/watch?v=ZCuYPiUIONs)
2. Andrew Clark Github: [https://github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
3. Philip Fabianek Youtube Playlist: [https://www.youtube.com/playlist?list=PLxRVWC-K96b0ktvhd16l3xA6gncuGP7gJ](https://www.youtube.com/playlist?list=PLxRVWC-K96b0ktvhd16l3xA6gncuGP7gJ)
4. Freecodecamp React Components & React Elements by Samer Buna : [https://www.freecodecamp.org/news/react-interview-question-what-gets-rendered-in-the-browser-a-component-or-an-element-1b3eac777c85/](https://www.freecodecamp.org/news/react-interview-question-what-gets-rendered-in-the-browser-a-component-or-an-element-1b3eac777c85/)

<br />感谢阅读!
