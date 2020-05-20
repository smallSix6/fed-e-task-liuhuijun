function makePower(power) {
  return function(number) {
    return Math.pow(number, power)
  }
}
let power2 = makePower(2)
let power3 = makePower(3)
console.log(power2(2))
console.log(power3(2))