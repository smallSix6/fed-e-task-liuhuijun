/* 
102. 二叉树的层序遍历
给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。
*/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if (!root) {
    return []
  }
  const q = [[root,0]]
  const res = []
  while(q.length) {
    const [n, l] = q.shift()
    if (!res[l]) {
      res.push([n.val])
    }else{
      res[l].push(n.val)
    }
    if (n.left) {
      q.push([n.left, l+1])
    }
    if (n.right) {
      q.push([n.right, l+1])
    }
  }
  return res
};
