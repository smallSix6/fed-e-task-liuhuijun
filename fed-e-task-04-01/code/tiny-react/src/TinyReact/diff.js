import mountElement from "./mountElement";
import updetaTextNode from "./updetaTextNode";
import updateNodeElement from "./updateNodeElement";
import createDOMElement from "./createDOMElement";
import unmountNode from "./unmountNode";
import diffComponent from "./diffComponent";

export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM;
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component;
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container);
  } else if (
    // 如果要比对的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件 因为组件要单独处理
    typeof virtualDOM.type !== "function"
  ) {
    // 不需要对比
    // 使用新的 virtualDOM 对象生成真实 DOM 对象
    const newElement = createDOMElement(virtualDOM);
    // 使用新的 DOM 对象替换旧的 DOM 对象
    oldDOM.parentNode.replaceChild(newElement, oldDOM);
  } else if (typeof virtualDOM.type === "function") {
    // 组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container);
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    if (virtualDOM.type === "text") {
      // 更新文本内容
      updetaTextNode(virtualDOM, oldVirtualDOM, oldDOM);
    } else {
      // 更新节点元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM);
    }

    // 将拥有key属性的元素放入 keyedElements 对象中
    let keyedElements = {};
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let domElement = oldDOM.childNodes[i];
      if (domElement.nodeType === 1) {
        let key = domElement.getAttribute("key");
        if (key) {
          keyedElements[key] = domElement;
        }
      }
    }
    // 看一看是否有找到了拥有 key 属性的元素
    let hasNoKey = Object.keys(keyedElements).length === 0;

    if (hasNoKey) {
      // 递归对比 Virtual DOM 的子元素
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i]);
      });
    } else {
      // 使用key属性进行元素比较
      virtualDOM.children.forEach((child, i) => {
        // 获取要进行比对的元素的 key 属性
        let key = child.props.key;
        // 如果 key 属性存在
        if (key) {
          // 到已存在的 DOM 元素对象中查找对应的 DOM 元素
          let domElement = keyedElements[key];
          // 如果找到元素就说明该元素已经存在 不需要重新渲染
          if (domElement) {
            // 虽然 DOM 元素不需要重新渲染 但是不能确定元素的位置就一定没有发生变化
            // 所以还要查看一下元素的位置
            // 看一下 oldDOM 对应的(i)子元素和 domElement 是否是同一个元素 如果不是就说明元素位置发生了变化
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              // 元素位置发生了变化
              // 将 domElement 插入到当前元素位置的前面 oldDOM.childNodes[i] 就是当前位置
              // domElement 就被放入了当前位置
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i]);
            }
          } else {
            mountElement(child, oldDOM, oldDOM.childNodes[i]);
          }
        }
      });
    }

    // 删除节点
    // 获取旧子节点
    const oldChildren = oldDOM.childNodes;
    // 获取新子节点
    const newChildren = virtualDOM.children;
    // 判断旧节点的数量
    if (oldChildren.length > newChildren.length) {
      if (hasNoKey) {
        // 有节点需要被删除
        for (let i = oldChildren.length - 1; i > newChildren.length - 1; i--) {
          unmountNode(oldChildren[i]);
        }
      } else {
        // 通过 key 属性删除节点
        for (let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i];
          let oldChildKey = oldChild._virtualDOM.props.key;
          let found = false;
          for (let n = 0; n < virtualDOM.children.length; n++) {
            if (oldChildKey === virtualDOM.children[n].props.key) {
              found = true;
              break;
            }
          }
          if (!found) {
            unmountNode(oldChild);
            i--;
          }
        }
      }
    }
  }
}
