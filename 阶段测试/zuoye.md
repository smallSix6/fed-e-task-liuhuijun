## 1、已知如下对象，请基于 es6 的 proxy 方法设计一个属性拦截读取操作的例子，要求实现去访问目标对象 example 中不存在的属性时，抛出错误：Property "$(property)" does not exist

```js
// 案例代码
const man = {
  name: 'jscoder',
  age: 22
}
//补全代码
const proxy = new Proxy(...)
proxy.name // "jscoder"
proxy.age // 22
proxy.location // Property "$(property)" does not exist
```

+ 回答如下代码：
```js
const proxy = new Proxy(man, {
  get(target, key) {
    if (target[key]) {
      return target[key]
    }
    return `Property "＄(property)" does not exist`
  }
})
```

## 2、红灯三秒亮一次, 绿灯一秒亮一次, 黄灯2秒亮一次
+ 实现一个函数，如何让三个灯不断交替重复亮灯? (用Promise实现) 三个亮灯函数已经存在:
```js
function red() {
  console.log('red')
} // 3秒
function green() {
  console.log('green')
} // 1秒
function yellow() {
  console.log('yellow')
} // 2秒
```

+ 回答如下代码：
```js
function red() {
  console.log('red')
}
function green() {
  console.log('green')
}
function yellow() {
  console.log('yellow')
}
function light(cb, timer) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve()
    }, timer);
  })
}

function lightRun() {
  light(red, 3000).then(() => {
    return light(green, 2000)
  }).then(() => {
    return light(yellow, 5000)
  }).finally(() => {
    return lightRun()
  })
}
lightRun()
```
 
## 3、按顺序写出控制台打印结果 （2020 碧桂园）
```js
var User = {
     count:1,
     action:{
     getCount:function () {
         return this.count
         }
     }
}
var getCount = User.action.getCount;
    setTimeout(() => {
    console.log("result 1",User.action.getCount())
})
console.log("result 2",getCount())
```

+ 回答如下：
+ result 2  undefined
+ result 1 undefined
+ 原因：首先浏览器执行 js 进入第一个宏任务进入主线程，代码从上往下执行，遇到 setTimeout 则放入宏任务队列先不执行，Call Stack 往下走，则打印出 ‘result 2  undefined’，执行到这儿的时候 Call Stack 为空，则看看有没有本轮的微任务，这段代码没有微任务，则执行第二轮宏任务，打印 setTimeout 里面的结果 ‘result 1 undefined’，这里需要注意的是 getCount 函数是 action 调用的，所以 this 指向 action，而 action 没有 count 属性，所以为 undefined

## 4、简答 (字节跳动 二面)
+ 你觉得 typescript 和 javascript 有什么区别?
+ typescript 你都用过哪些类型?
+ typescript 中 type 和 interface 的区别?

+ 回答如下：
  1. typescript 和 javascript 的区别：
    + TypeScript 和 JavaScript 是目前项目开发中较为流行的两种脚本语言，我们已经熟知 TypeScript 是 JavaScript 的一个超集。JavaScript 和 TypeScript 的主要差异：
      + 1、TypeScript 可以使用 JavaScript 中的所有代码和编码概念，TypeScript 是为了使 JavaScript 的开发变得更加容易而创建的。例如，TypeScript 使用类型和接口等概念来描述正在使用的数据，这使开发人员能够快速检测错误并调试应用程序
      + 2、TypeScript 从核心语言方面和类概念的模塑方面对 JavaScript 对象模型进行扩展。
      + 3、JavaScript 代码可以在无需任何修改的情况下与 TypeScript 一同工作，同时可以使用编译器将 TypeScript 代码转换为 JavaScript。
      + 4、TypeScript 通过类型注解提供编译时的静态类型检查。
      + 5、TypeScript 中的数据要求带有明确的类型，JavaScript不要求。
      + 6、TypeScript 引入了 JavaScript 中没有的“类”概念。
      + 7、TypeScript 中引入了模块的概念，可以把声明、数据、函数和类封装在模块中。
  2. typescript 你都用过哪些类型?
    + 数据类型：
      + String
      + Boolen
      + Number
      + Array
      + Enums
      + Any 
      + Void
  3. typescript 中 type 和 interface 的区别：


 