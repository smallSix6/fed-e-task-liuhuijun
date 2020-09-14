import mountElement from './mountElement'
import updetaTextNode from './updetaTextNode';
import updateNodeElement from './updateNodeElement';
import createDOMElement from './createDOMElement';
import unmountNode from './unmountNode';

export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (
    // 如果要比对的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件 因为组件要单独处理
    typeof virtualDOM.type !== "function"
  ) {
    // 不需要对比
    // 使用新的 virtualDOM 对象生成真实 DOM 对象
    const newElement = createDOMElement(virtualDOM)
    // 使用新的 DOM 对象替换旧的 DOM 对象
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    if (virtualDOM.type === 'text') {
      // 更新文本内容
      updetaTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 更新节点元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }
    // 对比子节点
    virtualDOM.children.forEach((child, i) => {
      diff(child, oldDOM, oldDOM.childNodes[i])
    })
    // 删除节点
    // 获取旧子节点
    const oldChildren = oldDOM.childNodes
    // 获取新子节点
    const newChildren = virtualDOM.children
    if (oldChildren.length > newChildren.length) {
      // 有节点需要被删除
      for (let i = oldChildren.length - 1; i > newChildren.length - 1; i--) {
        unmountNode(oldChildren[i])
      }
    }
  }
}