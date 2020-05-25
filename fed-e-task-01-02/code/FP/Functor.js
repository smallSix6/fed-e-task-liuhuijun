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



class Functor {
  static of(val) {
    return new Functor(val);
  }
  constructor(val) { 
    this.val = val; 
  }

  map(f) {
    return new Functor(f(this.val));
  }
}


// (new Functor(2)).map(function (two) {
//   return two + 2;
// });

// class Maybe {
//   static of(val) {
//     return new Maybe(val);
//   }
//   constructor(val) { 
//     this.val = val; 
//   }
//   map(f) {
//     return this.val ? Maybe.of(f(this.val)) : Maybe.of(null);
//   }
// }
// let mayBeFunctor = Maybe.of(null).map(function (s) {
//   return s.toUpperCase();
// });
// console.log(mayBeFunctor)

class Ap {
  static of(val) {
    return new Ap(val);
  }
  constructor(val) { 
    this.val = val; 
  }
  map(f) {
    return Ap.of(f(this.val));
  }
  ap(F) {
    return Ap.of(this.val(F.val))
  }
}

function addTwo(x) {
  return x + 2;
}
function add(x) {
  return function (y) {
    return x + y;
  };
}
console.log(Ap.of(add).ap(Functor.of(2)).ap(Functor.of(3)))



