
function once() {
  return function(this: any, fn: <T>(...args: T[]) => void ) {
    return fn.apply(this, [].slice.call(arguments))
  }
}