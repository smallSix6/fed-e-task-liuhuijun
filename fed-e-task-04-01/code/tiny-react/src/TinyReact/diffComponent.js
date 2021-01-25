import mountElement from "./mountElement";
import updateComponent from "./updateComponent";

export default function diffComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  // 判断要更新的组件和未更新的组件是否是同一个组件 只需要确定两者使用的是否是同一个构造函数就可以了
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 属同一个组件 做组件更新
    console.log("同一个组件");
    updateComponent(virtualDOM, oldComponent, oldDOM, container);
  } else {
    // 不是同一个组件 直接将组件内容显示在页面中
    mountElement(virtualDOM, container, oldDOM);
  }
}

// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  console.log(virtualDOM, oldComponent);
  return oldComponent && virtualDOM.type === oldComponent.constructor;
}
