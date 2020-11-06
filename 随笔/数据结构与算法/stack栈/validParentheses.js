/* 
20. 有效的括号
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串
*/
var isValid = function(s) {
  if (s.length % 2 === 1) {
    return false
  }
  let stack = []
  const map = new Map()
  map.set('(',')')
  map.set('[',']')
  map.set('{','}')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (map.has(c)) {
      stack.push(c)
    }else {
      const t = stack[stack.length-1]
      if (
        map.get(t) === c
      ){
        stack.pop()
      } else {
        return false
      }
    }
  }
  return stack.length === 0
};

