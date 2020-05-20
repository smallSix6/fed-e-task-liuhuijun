// 高阶函数-函数作为参数
// function forEach (array, fn) {
//   for (let i = 0; i < array.length; i++) {
//     fn(array[i])
//   }
// }

// 测试
// let arr = [1,2,3,4,5,5]
// forEach(arr,function(item) {
//   console.log(item)
// })



// filter
// function filter(array, fn) {
//   let result = []
//   for (let i = 0; i < array.length; i++) {
//     if (fn(array[i])) {
//       result.push(array[i])
//     }
//   }
//   return result
// }

// let arr = [1,2,3,4,5,5]
// let r = filter(arr, function(item){
//   return item % 2 === 0
// })
// console.log(r)


// 高阶函数-函数作为返回值
function once(fn) {
  let done = false
  return function() {
    if (!done) {
      done = true
      fn.apply(this, arguments)
    }
  }
}
let pay = once(function (money) {
  console.log(`支付:${money}RMB`)
})
pay(5)
pay(5)
pay(5)
pay(5)
