const fp = require('lodash/fp')
class IO {
  static of(value) {
    return new IO(function() {
      return value
    })
  }
  constructor(fn) {
    this._value = fn
  }
  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

//new IO(function(){return process}) => r._value = function(){return process}
let r = IO.of(process) 
 
//new IO(fp.flowRight(p=>p.execPath, function(){return process})) => r1._value = fp.flowRight(p=>p.execPath, function(){return process})
let r1 = r.map(p => p.execPath)
console.log(r._value())
