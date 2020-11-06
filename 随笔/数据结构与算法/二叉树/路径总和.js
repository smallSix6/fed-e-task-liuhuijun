/* 
112. 路径总和
给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

说明: 叶子节点是指没有子节点的节点。
*/
var hasPathSum = function(root, sum) {
  if (!root) {
    return false
  }
  let res = false
  const dfs = (n, val) => {
    if (!n.left && !n.right && val === sum) {
      return true
    }
    if(n.left) dfs(n.left, val + n.left.val)
    if(n.right) dfs(n.right, val+ n.right.val)
  }
  dfs(root,root.val)
  return res
};

