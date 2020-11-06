/* 
83. 删除排序链表中的重复元素
给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
*/
var deleteDuplicates = function(head) {
  let p = head
  while (p && p.next) {
    if(p.next.val === p.val) {
      p.val = p.next.val
      p.next = p.next.next
    }else{
      p = p.next
    }
    
  }
  return head
};

