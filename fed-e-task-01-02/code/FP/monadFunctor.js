// IO Monad
const fs = require('fs')
const fp = require('lodash/fp')

class IO {
  static of(value) {
    return new IO(function () {
      return value
    })
  }

  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }

  join() {
    return this._value()
  }

  flatMap(fn) {
    return this.map(fn).join()
  }
}

let readFile = function (filename) {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8')
  })
}

let print = function (x) {
  return new IO(function () {
    console.log(x)
    return x
  })
}

let r = readFile('package.json')
  .map(x => x.toUpperCase())
  .map(fp.toUpper)
  .flatMap(print)
  .join()

console.log(r)


// const arr = ['apple', 'pen', 'apple-pen'];
// for(const i in arr){
//   console.log(i)
//   const c = arr[i][0];
//   arr[i] = c.toUpperCase() + arr[i].slice(1);
// }


// function applyMiddleware() {
//   for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
//     middlewares[_key] = arguments[_key];
//   }

//   return function (createStore) {
//     return function (reducer, preloadedState, enhancer) {
//       var store = createStore(reducer, preloadedState, enhancer);
//       var _dispatch = store.dispatch;
//       var chain = [];

//       var middlewareAPI = {
//         getState: store.getState,
//         dispatch: function dispatch(action) {
//           return _dispatch(action);
//         }
//       };
//       chain = middlewares.map(function (middleware) {
//         return middleware(middlewareAPI);
//       });
//       _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

//       return _extends({}, store, {
//         dispatch: _dispatch
//       });
//     };
//   };
// }
// applyMiddleware().(createStore).(reducer, preloadedState, enhancer)
