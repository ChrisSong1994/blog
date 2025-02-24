---
title: "for...in、Object.keys、Object.getOwnPropertyNames 的区别"
date: "2019-10-23"
excerpt: 这片文章，我们将讨论下 React Virtual DOM  和 Reconciliation 的工作原理
tags: ["Javascript"]
---

最近在读 underscore 的源码，发现了一个疑问,在 underscore 中有两个方法*.keys 和*.allKeys 这两个方法都是用来获取对像的属性，两个之间有什么不同呢？先看下 underscore 源码

```javascript
// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
_.keys = function (obj) {
  if (!_.isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
};

// Retrieve all the property names of an object.
_.allKeys = function (obj) {
  if (!_.isObject(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
};
```

源码中的注释写道*.keys 用来获取对象自己的属性 , *.allKeys 用来获取对象所有的属性，为什么两种获取得到属性不一样？看到这里不太明白，但是注意到了 _.keys 和 _.allKeys 的核心代码是 Objecft.keys 和 for in ，那么我就开始查看下文档找下两者的具体区别。
在 MDN 中我们可以找到三者的描述：

- for…in：循环只遍历可枚举属性。像 Array 和 Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的不可枚举属性，例如 String 的 indexOf() 方法或 Object 的 toString()方法。循环将遍历对象本身的所有可枚举属性，以及对象从其构造函数原型中继承的属性（更接近原型链中对象的属性覆盖原型属性）。
- Objecft.keys：返回一个所有元素为字符串的数组，其元素来自于从给定的 object 上面可直接枚举的属性。这些属性的顺序与手动遍历该对象属性时的一致。
- Object.getOwnPropertyNames：方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

由描述可以理解为：

- for…in 会遍历对象的自身的和继承的可枚举属性；
- Objecft.keys 只能获取自身的可枚举属性;
- Object.getOwnPropertyNames 可以获取自身的所有属性(包括不可枚举属性)

下面用一个例子来做下验证

```javascript
var parent = {
  a: "a",
};
var child = Object.create(parent, {
  b: {
    value: "b",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  c: {
    value: "c",
    writable: true,
    enumerable: false,
    configurable: true,
  },
});
```

我们创建了一个对象 parent，其有一个属性 a,接着创建了一个对象 child 其继承了 parent 并有两个属性 b 和 c,c 是不可枚举属性，下面我们用三种方式来获取 child 的属性

```javascript
for (var key in child) {
  console.log(key); // b a // 会去继承的属性
}

console.log(Object.keys(child)); // ["b”]

console.log(Object.getOwnPropertyNames(child)); // ["b", "c"]
```

总结：现在我们已经知道三种获取对象属性方式用法的区别，在不同场景中具体使用才能起到有效的解决问题，不能用混。
