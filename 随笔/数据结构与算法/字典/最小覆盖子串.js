/* 
76. 最小覆盖子串
给你一个字符串 S、一个字符串 T 。请你设计一种算法，可以在 O(n) 的时间复杂度内，从字符串 S 里面找出：包含 T 所有字符的最小子串。

示例：

输入：S = "ADOBECODEBANC", T = "ABC"
输出："BANC"
*/
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  let l = 0, r = 0
  const need = new Map()
  for (const c of t) {
    need.set(c,need.has(c)?need.get(c)+1:1)
  }
  let needType = need.size
  let res =''
  while(r < s.length) {
    const c = s[r]
    if (need.has(c)) {
      need.set(c,need.get(c)-1)
      if (need.get(c) === 0) {
        needType -= 1
      }
    }
    while (needType === 0) {
      let resnew = s.substring(l,r+1)
      if (!res || resnew.length < res.length) {
        res = resnew
      }
      const c2 = s[l]
      if (need.has(c2)) {
        need.set(c2,need.get(c2)+1)
        if (need.get(c2) === 1) {
          needType += 1
        }
      }
      l += 1
    }
    r += 1
  }
  return res
};



