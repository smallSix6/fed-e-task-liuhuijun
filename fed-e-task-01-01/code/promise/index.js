/*
  1、Promise 就是一个类 在执行这个类的时候 需要传递一个执行器进去 执行器会立即执行
  2、Promise 中有三种状态 分别为 成功 fulfilled 失败 rejected 等待 pending
      pending -> fulfilled
      pending -> rejected
    一旦状态确定就不可更改
  3、resolve 和 reject 函数是用来更改状态的
    resolve: fulfilled
    reject: rejected
  4、then 方法内部做的事情就是判断状态  如果状态成功 调用成功的回调函数  如果状态失败  调用失败的回调函数  then 方法是被定义在原型对象中的
  5、then 成功回调有一个参数 表示成功之后的值  then 失败回调有一个参数 表示失败后的原因

*/
const MyPromise = require('./promise')

function p1() {
    return new MyPromise(function(resolve, reject) {
        setTimeout(() => {
            resolve('p1')
        }, 2000);
    })
}

function p2() {
    return new MyPromise(function(resolve, reject) {
        // resolve('p2')
        reject('p2 reject')
    })
}
p2().then(value => console.log(value))
    .catch(reason => {
        console.log(reason)
    })

// MyPromise.all(['a', 'b', p1(), p2(), 'c']).then(result => console.log(res))

// MyPromise.resolve(100).then(value => console.log(value))
// MyPromise.resolve(p1()).then(value => console.log(value))

// p2().finally(() => {
//     console.log('finally')
//     return p1()
// }).then(value => {
//         console.log(111, value)
//     },
//     reason => {
//         console.log(222, reason)
//     }
// )








// let promise = new MyPromise((resolve, reject) => {

//     // setTimeout(() => {
//     //     resolve('成功')
//     //         // reject('失败')
//     // }, 2000);
//     // throw new Error('exector error')
//     // resolve('成功')
//     reject('失败')
// })

// function other() {
//     return new MyPromise((resolve, reject) => {
//         resolve('other')
//     })
// }
// let p1 = promise.then(
//     value => {
//         console.log(111, value)
//         return 'aaaa'
//             // throw new Error('then error')
//     },
//     reason => {
//         console.log(222, reason)
//         return 1000
//     }
// ).then(value => {
//     console.log(value)
// })


// promise.then().then().then(value => console.log(value), reason => console.log(reason))