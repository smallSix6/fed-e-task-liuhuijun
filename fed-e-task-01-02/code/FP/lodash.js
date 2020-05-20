// 演示lodash
// first/last/toUpper/reverse/each/includes/find/findIndex
const _ = require('lodash')
// const array = ['jsck', 'tom', 'lucy', 'kate']
// console.log(_.first(array))
// console.log(_.first(array))
// console.log(_.first(array))

// 记忆函数
function getArea(r) {
  console.log(r)
  return Math.PI*r*r
}
function memoize(f) {
  let cache = {}
  return function() {
    let key = JSON.stringify(arguments)
    return cache[key]=cache[key] || f.apply(f,arguments)
  }
}
// let getAreaWithMemory = _.memoize(getArea)
let getAreaWithMemory = memoize(getArea)
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))

