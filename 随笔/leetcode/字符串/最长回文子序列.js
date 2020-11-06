/**
 * @param {string} s
 * @return {number}
 */
var longestPalindromeSubseq = function(s) {
  let n = s.length;

  const dp = [];
  for (let i = 0; i < n; i++) {
      dp[i] = [];
      for (let j = 0; j < n; j++) {
          // base case 当i==j时，dp[i][j]为1，1个字符,其他元素都初始化为0
          if (i === j) {
              dp[i][j] = 1;
          } else {
              dp[i][j] = 0;
          }
      }
  }
  
  // 从下往上反着遍历
  for (let i = n - 1; i >= 0; i--) {
      for (let j = i + 1; j < n; j++) {
          // 选择，对应的状态改变
          if (s[i] === s[j]) {
              dp[i][j] = dp[i+1][j-1] + 2;
          } else {
              dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
          }
      }
  }

  // 所求结果
  return dp[0][n-1];
};


console.log(longestPalindromeSubseq('baab'))
