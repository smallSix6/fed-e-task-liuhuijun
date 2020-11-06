function transform (n) {
  let stack = []
  while (n) {
    stack.push(n%2)
    n = Math.floor(n/2)
  }
  console.log(stack)
  return stack.reverse().join('')
}
console.log(transform(10))
