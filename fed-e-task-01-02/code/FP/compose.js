// 函数组合演示
// function compose(f, g) {
//   return function(value) {
//     return f(g(value))
//   }
// }
// function reverse(arr) {
//   return arr.reverse()
// }
// function first(arr) {
//   return arr[0]
// }
// const last = compose(first, reverse)
// console.log(last([1,2,3,4]))


// 模拟lodash中的flowRight
const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()



// function compose(...args) {
//   return function(value) {
//     return args.reverse().reduce(function(acc, fn) {
//       return fn(acc)
//     }, value)
//   }
// }
const compose = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)
const f = compose(toUpper, first, reverse)
console.log(f(['one', 'two', 'three']))

