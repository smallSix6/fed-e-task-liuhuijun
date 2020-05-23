// 高阶函数-函数作为参数: forEach、filter、map、every和some
// foreach函数实现
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



// filter函数实现
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


// map函数实现
// const map = (array, fn) => {
//   let result = []
//   for (const value of array) {
//     result.push(fn(value))
//   }
//   return result
// }
// let arr = [1,2,3,4,5,5]
// console.log(map(arr,v=>v+v))

//every函数实现
// const every = (array, fn) => {
//   for (const value of array) {
//     if(!fn(value)) {
//       return false
//     }
//     return true
//   }
// }
// let arr = [1,2,3,4,5,5]
// console.log(every(arr, (item) => {
//   return item % 1 === 0
// }))

// some函数实现
// const some = (array, fn) => {
//   for (const value of array) {
//     if(fn(value)) {
//       return true
//     }
//   }
//   return false
// }
// let arr = [1,2,3,4,5,5]
// console.log(some(arr, (item) => {
//   return item > 7
// }))

// 高阶函数-函数作为返回值
function Once(fn) {
  let done = false
  return function() {
    if (!done) {
      done = true
      fn.apply(this, arguments)
    }
  }
}
let pay = new Once(function (money) {
  console.log(`支付:${money}RMB`)
})

const func =  function (money) {
  console.log(`支付:${money}RMB`)
}
const pay1 = once(func)
pay1(500)
pay1(500)
pay1(500)

