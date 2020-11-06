function split(arr) {
  if (arr.length === 1) {
    return arr
  }
  let num = Math.floor(arr.length/2)
  let left = arr.slice(num, arr.length)
  let right = arr.slice(0, num)
  let orderLeft = split(left)
  let orderRight = split(right)
  let res = []
  while (orderLeft.length || orderRight.length) {
    if (orderLeft.length && orderRight.length) {
      res.push(orderLeft[0]<orderRight[0]?orderLeft.shift():orderRight.shift())
    }else if(orderLeft.length) {
      res.push(orderLeft.shift())
    }else if(orderRight.length) {
      res.push(orderRight.shift())
    }
  }
  return res
}
let arr1 = [5,4,3,2,1]
console.log(split(arr1))



