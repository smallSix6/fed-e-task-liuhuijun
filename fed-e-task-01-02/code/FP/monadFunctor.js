// // IO Monad
// const fs = require('fs')
// const fp = require('lodash/fp')

// class IO {
//   static of (value) {
//     return new IO(function () {
//       return value
//     })
//   }

//   constructor (fn) {
//     this._value = fn
//   }

//   map (fn) {
//     return new IO(fp.flowRight(fn, this._value))
//   }

//   join () {
//     return this._value()
//   }

//   flatMap (fn) {
//     return this.map(fn).join()
//   }
// }

// let readFile = function (filename) {
//   return new IO(function () {
//     return fs.readFileSync(filename, 'utf-8')
//   })
// }

// let print = function (x) {
//   return new IO(function () {
//     console.log(x)
//     return x
//   })
// }

// let r = readFile('package.json')
//           .map(x => x.toUpperCase())
//           .map(fp.toUpper)
//           .flatMap(print)
//           .join()

// console.log(r)


const arr = ['apple', 'pen', 'apple-pen'];
for(const i in arr){
  console.log(i)
  const c = arr[i][0];
  arr[i] = c.toUpperCase() + arr[i].slice(1);
}