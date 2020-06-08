// if (cond) ? thn : els

// IF(cond)(thn)(els)
// IF = function(cond) {
//   return function(thn) {
//     return function(els) {
//       return cond(thn)(els)
//     }
//   }
// }

// //TRUE
// tru = function(thn) {
//   return function(els) {
//     return thn
//   }
// }

// //FLASE
// fls = function(thn) {
//   return function(els) {
//     return els
//   }
// }

/*
IF(tru) = function(thn) {
  return function(els) {
    return function(1) {
      return function(2) {
        return 1
      }
    }
    //return cond(thn)(els)
  }
}
*/

// console.log(IF(tru)(1)(2))
// console.log(IF(fls)(1)(2))


var range = (start, end) => (next, complete, acc) =>
  start <= end
    ? range(start + 1, end)(next, complete, next(start, acc))
    : complete(acc);

var map = (source, f) => (next, complete, acc) =>
  source((item, acc) => next(f(item), acc), complete, acc);

var reverse = source => (next, complete, acc) =>
  source((n, f) => acc => f(next(n, acc)), f => f(acc), x => x);

var foreach = (source, f) => source(n => f(n), () => {});

var numbers = range(1, 10);
console.log(numbers)
numbers = map(numbers, n => n * n);
numbers = reverse(numbers);
let 
// foreach(numbers, console.log);

var sum = source => source((n, acc) => acc + n, x => x, 0);
var toString = source => source((n, acc) => acc + n + " ", x => x, "");
var toArray = source => source((item, list) => list.concat(item), x => x, []);

console.log("sum", sum(numbers));
console.log("string", toString(numbers));
console.log("array", toArray(numbers));
