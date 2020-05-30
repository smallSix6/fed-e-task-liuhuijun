// 柯里化案例
const _ = require('lodash')
const match = curry(function(reg,str) {
  return str.match(reg)
})

function curry(fn) {
  return function curriedFn(...args) {
    if (args.length<fn.length) {
      return function() {
        // return fn(...args, ...arguments)
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}

function getSum (a, b, c) {
  return a + b + c
}

const myCurried = curry(getSum)
console.log(myCurried(1, 2, 3)) // 6
console.log(myCurried(1)(2, 3))// 6
console.log(myCurried(1, 2)(3))// 6
console.log(myCurried(1)(2)(3))// 6

// const haveSpace = match(/\s+/g)
// const haveNumber = match(/\d+/g)
// const filter = curry((func,array)=>array.filter(func))
// const findSpace = filter(haveSpace)


// console.log(findSpace(['saaa dddd','sdfs']))
// console.log(haveSpace('hello world'))
// console.log(haveNumber('abc11'))

