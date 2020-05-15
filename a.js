let arr = [12,34,32,89,4]
let res = arr.reduce((preValue, curValue)=>{
  let result;
  if (preValue < curValue) {
    result = preValue
  } else {
    result = curValue
  }
  return result
})
console.log(res)
