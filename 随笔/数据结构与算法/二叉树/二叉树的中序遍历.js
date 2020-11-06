/* 
94. 二叉树的中序遍历
给定一个二叉树，返回它的中序 遍历。
*/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */

var inorderTraversal = function(root) {
  let res = []
  const stack = []
  let p = root
  while (stack.length || p) {
    while (p) {
      stack.push(p)
      p = p.left
    }
    const n = stack.pop()
    res.push(n.val)
    p = n.right
  }
  return res
};
// var inorderTraversal = function(root) {
//   let res = []
//   let rec = (n) => {
//     if (!n) {
//       return []
//     }
//     rec(n.left)
//     res.push(n.val)
//     rec(n.right)
//   }
//   rec(root)
//   return res
// };
