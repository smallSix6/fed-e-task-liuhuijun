// var obj = {
//   prop: function() {},
//   foo: 'bar'
// };

// // New properties may be added, existing properties
// // may be changed or removed.
// obj.foo = 'baz';
// obj.lumpy = 'woof';
// delete obj.prop;

// var o = Object.seal(obj);

// o === obj; // true
// Object.isSealed(obj); // === true

// Changing property values on a sealed object
// still works.
// obj.foo1 = 'quux';
// console.log(obj)


// function fn1() {return 10}
// function fn2() {return 20}
// function fn3() {return 30}
// function adds() {
//   let params = [...arguments]
//   return params.reduce((pre, cur)=>{
//     if (typeof pre === 'function') {
//       return pre() + cur()
//     } else {
//       return pre+cur()
//     }
//     result = pre() + cur()
//   })
// }
// console.log(adds(fn1,fn2,fn3))

// Promise.resolve(1)
// .then(2)
// .then(Promise.resolve(3))
// .then(console.log)


// Promise.resolve(1)
// .then(2)
// .then(Promise.resolve(3))
// .then(()=>{return 9})
// .then(console.log)


// Promise.resolve(1)
// .then(2)
// .then(Promise.resolve(3))
// .then(function(){return 9})
// .then(console.log)


// Promise.resolve(1)
// .then(2)
// .then(Promise.resolve(3))
// .then(()=>{return 9})
// .then((res)=>console.log(res))

// function reactive(obj) {
//   return new Proxy(obj,{
//     get (target,property) {
//       return target[property]
//     },
//     set (target, property, value) {
//       watch(property, value)
//       target[property] = value
//     }
//   }) 
// }
// function watch(property,value) {
//   console.log(`${property} changed: ${value}`)
// }
// const state = reactive({
//   foo: 100,
//   bar: 200
// })
// state.foo++;
// state.bar++;

// function reactive(obj) {
//   const dep = {}
//   return new Proxy(obj, {
//     get (target, key) {
//       dep[key] = dep[key] || watch.effect
//       return Reflect.get(target, key)
//     },
//     set (target, key, value) {
//       console.log(value)
//       Reflect.set(target, key, value)
//     }
//   })
// }
// function watch(effect) {
//   watch.effect = effect
//   effect()
// }
// const state = reactive({
//   foo: 100,
//   bar: 200
// })
// watch(()=>{
//   console.log('foo change', state.foo)
// })
// watch(()=>{
//   console.log('bar change', state.bar)
// })
// state.foo++;
// state.bar++;

// const obj = {
//   name: 'tom',
//   student: {
//       work: 'AAAA',
//       say: () => {
//           console.log('嵌套对象的箭头函数');
//           console.log(this);  
//           console.log(this.name); 
//       },
//       eat: function () {
//           console.log('嵌套对象的普通函数');
//           console.log(this); 
//           console.log(this.name); 
//       }
//   }
// }
// obj.student.say()
// obj.student.eat()

// var foo = {a:1}
// async function main() {
//     let res = Object.assign(foo, await Promise.resolve({b:2}))
//     console.log(res)
// }
// main()
// foo = {a:2}
// console.log('begin',foo)

// const axios = require('axios')


// const urls = [
//   "https://api.github.com",
//   "https://api.github.com/users",
//   "https://sss.xxx.com/ssdd",

// ]

// // const promises = urls.map(item => axios(item))

// // const promises = urls.map(item => axios(item).then(res=>res.status)) // 对每一个promise异常进行捕获
// const promises = urls.map(item => axios(item).catch(e=>({})))
// const p = Promise.all(promises)

// p.then(result => {
//   console.log(result)
// })
// .catch(error => {
//   console.log('error: ',error.message)
// })


// var signUp = function(attrs) {
//   var user = saveUser(attrs);
//   welcomeUser(user);
// };
// var saveUser = function(attrs) {
//     var user = Db.save(attrs);
// };
// var welcomeUser = function(user) {
//     Email(user, ...);
// };
// // 纯的
// var signUp = function(Db, Email, attrs) {
//   return function() {
//     var user = saveUser(Db, attrs);
//     welcomeUser(Email, user);
//   };
// };
// var saveUser = function(Db, attrs) {};
// var welcomeUser = function(Email, user) {};

// const fp = require('lodash/fp')
// class Container {
//   static of (value) {
//     return new Container(value)
//   }

//   constructor (value) {
//     this._value = value
//   }

//   map (fn) {
//     return Container.of(fn(this._value))
//   }
// }

// class Maybe {
//   static of (x) {
//     return new Maybe(x)
//   }

//   isNothing () {
//     return this._value === null || this._value === undefined
//   }

//   constructor (x) {
//     this._value = x
//   }

//   map (fn) {
//     return this.isNothing() ? this : Maybe.of(fn(this._value))
//   }
// }

// module.exports = {
//   Maybe,
//   Container
// }

// let maybe = Maybe.of([1, 2, 1])
// let ex1 = function (x) {
//   return maybe.map(fp.map(fp.add(x)))
// }
// let r = ex1(1)

// console.log(r._value)

// const browserSync = require('browser-sync')
// console.log(222, browserSync)
// const bs = browserSync.create()
// console.log(222, bs)


// function Parent(name) {
//   this.name = name
// }
// function Child(name) {
//   Parent.call(this, name)
// }
// var child1 = new Child('kevin');

// console.log(child1.name); // kevin

// var child2 = new Child('daisy');

// console.log(child2.name); // daisy


"use strict";

var myClosure = (function outerFunction() {

  var hidden = 1;

  return {
    inc: function innerFunction() {
      return hidden++;
    }
  };

}());

myClosure.inc();  // 返回 1
myClosure.inc();  // 返回 2
myClosure.inc();  // 返回 3

