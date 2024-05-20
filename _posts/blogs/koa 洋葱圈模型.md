---
title: "koa 洋葱圈模型"
date: "2022-03-17"
excerpt: "koa 洋葱圈模型是由koa-compose实现，本文将简要介绍下洋葱圈的本质"
tags: ["koa","javascript","nodejs"]
---


koa 洋葱圈模型是由[koa-compose](https://github.com/koajs/compose)实现，本文将简要介绍下洋葱圈的本质，⚠️**注意代码注释**；

![image.png](https://cdn.nlark.com/yuque/0/2023/png/241994/1692662375102-9633ba6a-32c3-47da-8f15-d8edb2ca9b5b.png#averageHue=%23414141&clientId=u574f1700-3a4d-4&from=paste&height=435&id=u5b2822aa&originHeight=435&originWidth=478&originalType=binary&ratio=1&rotation=0&showTitle=false&size=60929&status=done&style=none&taskId=u2d8f76ca-320e-4243-a95f-f9f85452ace&title=&width=478)
我们通过 use 注册中间件，中间件函数有两个参数第一个是上下文，第二个是 next，在中间件函数执行过程中，若遇到 next() ，那么就会进入到下一个中间件中执行，下一个中间执行完成后，在返回上一个中间件执行 next() 后面的方法，这便是中间件的执行逻辑。
```javascript
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

```

洋葱圈的本质：中间件的compose 是多层promise 的嵌套，**next 是下个中间件函数的包装函数（本质是一个promise）**，async 的执行是next 前由外向内，每次next 执行会进入到下个中间件，next后的部分是由内向外，从而达到中间件的洋葱圈模型；

```javascript
// koa-compose/index.js
function compose(middleware) {
    // middleware 函数数组
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
    /*
      content:上下文  
      next:新增一个中间件方法，位于所有中间件末尾，用于内部扩展
    */
    return function (context, next) {
        // last called middleware #
        let index = -1 // 计数器，用于判断中间是否执行到最后一个
        return dispatch(0) // 开始执行第一个中间件方法
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i] // 获取中间件函数
            if (i === middleware.length) fn = next // 如果中间件已经到了最后一个，执行内部扩展的中间件
            if (!fn) return Promise.resolve()  // 执行完毕，返回 Promise
            try {
                // 执行 fn ，将下一个中间件函数赋值给 next 参数，在自定义的中间件方法中显示的调用 next 函数，中间件函数就可串联起来了
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

```
