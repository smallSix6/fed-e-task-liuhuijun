function quickSort(arr) {
  if (arr.length <= 1) { return arr }
  let left = []
  let right = []
  let mid = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i])
    }else {
      right.push(arr[i])
    }
  }
  return [...quickSort(left), mid, ...quickSort(right)]
}
let arr1 = [5,4,3,3,111,222,555,2,1]

console.log(quickSort(arr1))
