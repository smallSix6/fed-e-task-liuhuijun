// 柯里化案例
const _ = require('lodash')
const match = curry(function(reg,str) {
  return str.match(reg)
})

function curry(fn) {
  return function curriedFn(...args) {
    if (args.length<fn.length) {
      return function() {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}

const haveSpace = match(/\s+/g)
const haveNumber = match(/\d+/g)
const filter = curry((func,array)=>array.filter(func))
const findSpace = filter(haveSpace)


console.log(findSpace(['saaa dddd','sdfs']))
console.log(haveSpace('hello world'))
console.log(haveNumber('abc11'))

