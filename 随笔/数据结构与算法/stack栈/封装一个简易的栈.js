class Stack {
  constructor () {
    this.stack = []
  }
  push (item) {
    this.stack.push(item)
  }
  pop () {
    this.stack.pop()
  }
  peek () {
    return this.stack.length ? this.stack[this.stack.length-1]:null
  }
}
let stack = new Stack();
console.log(stack.push(1));
console.log(stack.push(2));
console.log(stack.pop());
console.log(stack.peek());