import createDOMElement from "./createDOMElement";
import unmountNode from "./unmountNode";

export default function mountNativeElement(virtualDOM, container, oldDOM) {
  let newElement = createDOMElement(virtualDOM);
  // 将转换之后的 DOM 对象放置在页面中
  container.appendChild(newElement);
  if (oldDOM) {
    container.insertBefore(newElement, oldDOM);
  } else {
    container.appendChild(newElement);
  }
  // 判断旧的 DOM 对象是否存在，如果存在就删除
  if (oldDOM) {
    unmountNode(oldDOM);
  }
  // 将节点挂载到页面中
  container.appendChild(newElement);
  let component = virtualDOM.component;
  if (component) {
    component.setDOM(newElement);
  }
}
