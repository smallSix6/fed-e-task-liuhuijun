# 刘惠俊 | Part1 | 模块一
## 简答题

### 第一题
  最终执行结果：10.
  原因：首先我们需要明确的每一次循环都会在a数组后push一个函数，这个函数打印i，等10次循环完了后，就等于往a数组里push了10个打印i的函数，所以等这个循环结束后i的值就变为了10，所以不管我们执行a数组里的哪个函数，最后都会打印10，我们可以使用闭包来解决这个问题。如果当前运行环境支持es6的话，我们可以用let替代var，这样就有了块级作用域的概念，则每次都会打印当前的i。
### 第二题
最终执行结果：报错。
原因：const和let声明的变量必须要在声明之后才可以使用，用var声明的变量才存在变量提升.
### 第三题
``` javascript
// 第一种方法
let arr = [12, 34, 32, 89, 4]
const minValue = Math.min(...arr)
console.log(minValue) // 4

// 试试reduce方法
let arr = [12, 34, 32, 89, 4]
let mininum = arr.reduce((pre, cur) => {
  let result
  if (pre < cur) {
    result = pre
  } else {
    result = cur
  }
  return result
})
```
### 第四题
  1.var 声明的是全局变量，全局变量就意味着，会挂载到window对象上面去，而let和const声明的变量去不会出现这样的情况。
  2.let和const声明的变量不会存在变量提升，所以必须先声明后使用。而var存在变量提升，在声明前使用，则值为undefined
  3.作用域上面 var是全局的 let和const则是块级作用域的
  4.const声明的变量 必须赋值 且赋值后也不能更改(obiect类型指不能改变内存地址，属性值可以更改)

### 第五题
  最终执行结果：20。
  原因：obj调用了fn,则fn中的this为obj，而setTimeout中的函数是箭头函数，箭头函数中的this指向的是上层作用域中的this，也就是普通函数fn(){}函数体的this,所以最后的this.a即obj.a=20

### 第六题
  Symbol类型的用途：
        1.不需要对外操作和访问的属性使用Symbol来定义
        2.使用Symbol来替代常量
        3.设置私有属性，实例上访问不到symbol属性
        4.使用Symbol来替代常量
### 第七题
  浅拷贝：在浅拷贝时，值类型会直接拷贝，而引用类型只拷贝了变量的地址，新的变量和原变量还会指向同一个堆中的区域。新变量的改变会对原变量产生影响，因为内存地址相同，其中一个变量的改变，其实改变的是同一个内存中的东西。如下代码
  ``` javascript
  function shallowClone(source) {
    let target = {};
    for(leti in source) {
        if (source.hasOwnProperty(i)) {
            target[i] = source[i];
        }
    }
    return target;
}
  ```
  深拷贝：会克隆出一个对象，数据相同，但是引用地址不同（就是拷贝A对象里面的数据，而且拷贝它里面的子对象），如下代码：
  ``` javascript
  function deepCopy(obj){
		let result = Array.isArray(obj)?[]:{};  
		if(obj && typeof obj === 'object'){ 
			for(let key in obj){
				if(obj.hasOwnProperty(key)){
					if(obj[key]&&typeof obj[key]==='object'){
						result[key]=deepCopy(obj[key]);
					}else{
						result[key]=obj[key];
					}
				}
			}
		}
		return result;
	}
  ```
### 第八题
  1.异步编程的理解：javascript语言的一大特点就是单线程，在某个特定的时刻只有特定的代码能够被执行，并阻塞其它的代码，也就是说，同一个时间只能做一件事。怎么做到异步编程？回调函数。直到nodejs的出现，开始将回调模式的异步编程机制发挥的淋漓尽致，这种机制开始在前端变得非常流行，但是慢慢也体现出了回调函数在错误处理和嵌套上的副作用。因为有了这些不足，所以异步解决方案一直在发展中，从 callback => promise => generator => async/await
  简单了解event loop

  2.EventLoop：javascript上， 所有同步任务都在主线程上执行，也可以理解为存在一个“执行栈”。主线程外，还有一个“任务队列”，任务队列的作用，就在等待异步任务的结果，只要异步任务有了运行结果，就会加入到“任务队列”中。一旦执行栈中所有同步任务执行完毕，就从 任务队列 中读取“任务”加入到“执行栈”中。主线程不断的在循环上面的步骤。

  3.宏任务和微任务：
  微任务是在主线程空闲时批量执行, 宏任务是在事件循环下一轮的最开始执行。宏任务和微任务的执行顺序如下：
    1、在执行上下文栈的同步任务执行完后；
    2、首先执行Microtask队列，按照队列先进先出的原则，一次执行完所有Microtask队列任务；
    3、然后执行Macrotask/Task队列，一次执行一个，一个执行完后，检测 Microtask是否为空；
    4、为空则执行下一个Macrotask/Task；
    5、不为空则执行Microtask
  常见的微任务有: process.nextTick、Promise和 MutationObserver监听DOM的变化。 
  常见的宏任务: setTimeout、setInterval、setImmediate、 script中整体的代码、 I/O操作、 UI渲染等。

### 第九题
  ``` javascript
  new Promise(resolve => {
    resolve('hello')
  }).then(res=>{
    return res+' lagou'
  }).then(res=>{
    console.log(res+ ', I love U')
  })
  ``` 

### 第十题
  JS 是运行在浏览器和 Node 上的脚本语言，TypeScript是 JavaScript 的超集，包含了 JavaScript 的所有元素，主要提供了类型系统和对 ES6 的支持

### 第十一题
  ### TS优点：
  #### TypeScript 增加了代码的可读性和可维护性
    1.类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
    2.可以在编译阶段就发现大部分错误，这总比在运行时候出错好
    3.增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等
    4.即使不显式的定义类型，也能够自动做出[类型推论]()
  #### TypeScript 拥有活跃的社区
    1.大部分第三方库都有提供给 TypeScript 的类型定义文件
    2.Google 开发的 Angular2 就是使用 TypeScript 编写的
    3.TypeScript 拥抱了 ES6 规范，也支持部分 ESNext 草案的规范
  ### TS缺点
    1.有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念
    2.短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本
    3.集成到构建流程需要一些工作量
    4.可能和一些库结合的不是很完美


  
