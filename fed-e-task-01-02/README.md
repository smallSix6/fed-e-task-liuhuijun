## **函数式编程** JS性能优化 

## 简答题

### 1. 描述引用计数的工作原理和优缺点。
​    答：引用计数的核心思想是设置引用数，判断当前引用数是否为0。每当一个对象被别的对象引用时，引用计数器就自增1，当别的对象与它断开引用关系时，引用计数器就自减1.当引用计数器为0时，GC就会去立即回收这个对象。
+ 优点：
  + 发现垃圾时立即回收
  + 最大限度减少程序暂停：应用程序运行过程中必然会堆内存进行消耗，而垃圾回收机制可以最大限度的减少内存爆满。
+ 缺点：
  + 无法回收引用循环的对象
  + 时间开销大，资源消耗大

### 2. 描述标记整理算法的工作流程。
    答：标记整理算法分标记、整理和清除三个阶段：先遍历所有对象找标记活动对象；再执行整理，移动对象位置，将碎片空间集中在一起，将释放出来不连续的分块整理成连续的分块，减少碎片化空间；最后遍历所有对象，清除没有标记对象，回收相应的空间。

### 3. 描述V8中新生代存储区垃圾回收的流程。
​		答：V8内存空间一分为二，小空间用于存储新生代对象( 64位系统中是32M，32位系统中是16M )，新生代指的是存活时间较短的对象。回收过程采用复制算法+标记整理，新生代内存区分为二个等大小空间，使用空间为From，空闲空间为To，活动对象存储于From空间，标记整理后将活动对象拷贝至To，From与To交换空间完成释放。拷贝过程中可能出现晋升，晋升就是将新生代对象移动至老生代，一轮GC还存活的新生代需要晋升。

### 4. 描述增量标记算法在何时使用，及工作原理。
    答：增量标记算法在V8老生代存储区垃圾回收时使用，将连续的垃圾回收拆分成多个”小步“与程序运行交替完成，提高回收效率。

---

## 代码题一

基于以下代码完成四个练习：

```js
const fp = require('lodash/fp')
// 数据
// horsepower 马力，dollar_value 价格， in_stock 库存
const cars = [
  {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
  {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
  {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
  {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
  {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
  {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: true},
]
```

### 练习1
+ 使用函数组合fp.flowRight重新实现下面这个函数：
```js
let isLastInStock = function (cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条数据的in_stock属性
  return fp.prop('in_stock', last_car)
}
```
+ 答：
```js
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)) // true
```


### 练习2
+ 使用fp.flowRight() fp.prop()和fp.first()获取第一个car的name
+ 答：
```js
let isFirstInStock = fp.flowRight(fp.curry(fp.prop)('name'), fp.first)
console.log(isFirstInStock(cars)) // Ferrari FF
```


### 练习3
+ 使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现
```js
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollorValue = function (cars) {
  let dollar_values = fp.map(function(car) {
    return car.dollar_value
  }, cars)
  return _average(dollar_values)
}
```
+ 答：
```js
let averageDollorValue = fp.flowRight(_average, fp.map(fp.props('dollar_value')))
console.log(averageDollorValue(cars)) // 790700
```


### 练习4
+ 使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如sanitizeNames(["Hello World"])=>["hello_world"]
```js
let _underscore = fp.replace(/\W+/g, '_') // 无需改动，并在sanitizeNames中使用到它
```
+ 答：
```js
let sanitizeNames = fp.map(fp.flowRight(fp.toLower, _underscore))
console.log(sanitizeNames(['Hello World'])) // [ 'hello_world' ]
```

---

## 代码题二
+ 基于下面提供的代码，完成后续的四个练习
```js
// support.js
class Container {
  static of (value) {
    return new Container(value)
  }
  constructor (value) {
    this._value = value
  }
  map (fn) {
    return Container.of(fn(this._value))
  }
}

class Maybe {
  static of (x) {
    return new Maybe(x)
  }
  isNothing () {
    return this._value === null || this._value === undefined
  }
  constructor (x) {
    this._value = x
  }
  map (fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value))
  }
}

module.exports = {
  Maybe,
  Container
}
```
### 练习1
+ 使用fp.add(x,y)和fp.map(f, x)创建一个能让Functor里的值增加的函数ex1
+ 答：
```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let maybe = Maybe.of([1, 2, 1])
let ex1 = function (x) {
  return maybe.map(fp.map(fp.add(x)))
}
let r = ex1(1)
console.log(r) // Maybe { _value: [ 2, 3, 2 ] }
```

### 练习2
+ 实现一个函数ex2，能够使用fp.first获取列表的第一个元素
+ 答：
```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = function () {
  return xs.map(fp.first)
}
let r = ex2()
console.log(r) // Container { _value: 'do' }
```

### 练习3
+ 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
+ 答：
```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x])
})
let user = {id: 2, name: 'Albert'}
let map = fp.curry(function (fn, functor){
  return functor.map(fn)
})
let ex3 = fp.flowRight(map(fp.first), safeProp('name'))
let r = ex3(user)
console.log(r) // Maybe { _value: 'A' }
```

### 练习4
+ 使用Maybe重写ex4，不要有if语句
+ 答：
```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = function (n) {
  return Maybe.of(n).map(parseInt)
}
let r = ex4('12') // Maybe { _value: 12 }
console.log(r)
```
