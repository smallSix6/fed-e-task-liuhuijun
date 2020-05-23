// class Container {
  // static of(value) {
  //   return new Container(value)
  // }
  // constructor(value) {
  //   this._value = value
  // }
  // map(fn) {
  //   return Container.of(fn(this._value))
  // }
// }
// let r = Container.of(5)
// let r1 = r.map(x=>x+2).map(x=>x*x)
// console.log(r, r1)


// class Left {
//   static of(value) {
//     return new Left(value)
//   }
//   constructor(value) {
//     this._value = value
//   }
//   map(fn) {
//     return this
//   }
// }

// class Right {
//   static of(value) {
//     return new Right(value)
//   }
//   constructor(value) {
//     this._value = value
//   }
//   map(fn) {
//     return Right.of(fn(this._value))
//   }
// }

// function ParseJson(str) {
//   try {
//     return Right.of(JSON.parse(str))
//   } catch (error) {
//     return Left.of({error: error.message})
//   }
// } 
// let r = ParseJson('{"name": "zs"}').map(
//   x => x.name.toUpperCase()
// )
// console.log(r)

 
