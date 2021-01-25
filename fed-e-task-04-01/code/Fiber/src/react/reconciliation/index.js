import { createTaskQueue, arrified, createStateNode, getTag } from "../Misc";
import { updateNodeElement } from "../DOM";

const taskQueue = createTaskQueue();
let subTask = null;
let pendingCommit = null;

const commitAllWork = (fiber) => {
  // 循环 effects 数组，构建 DOM 节点树
  fiber.effects.forEach((item) => {
    if (item.effectTag === "update") {
      // 更新
      if (item.type === item.alternate.type) {
        // 节点类型相同
        updateNodeElement(item.stateNode, item, item.alternate);
      } else {
        // 节点类型不同
        item.parent.stateNode.replaceChild(
          item.stateNode,
          item.alternate.stateNode
        );
      }
    } else if (item.effectTag === "placement") {
      let fiber = item;
      let parentFiber = item.parent;
      while (
        parentFiber.tag === "class_component" ||
        parentFiber.tag === "function_component"
      ) {
        parentFiber = parentFiber.parent;
      }
      if (fiber.tag === "host_component") {
        parentFiber.stateNode.appendChild(fiber.stateNode);
      }
    }
  });
  // 备份旧的 fiber 对象
  fiber.stateNode.__rootFiberContainer = fiber;
};

const getFirstTask = () => {
  const task = taskQueue.pop();
  if (task) {
    return {
      props: task.props,
      stateNode: task.dom,
      tag: "host_root",
      effects: [],
      child: null,
      alternate: task.dom.__rootFiberContainer,
    };
  }
};

const reconcileChildren = (fiber, children) => {
  console.log("fiber", fiber);
  const arrifiedChildren = arrified(children);
  // 记录循环 child 时候的下标
  let index = 0;
  // child 的长度
  let numberOfElements = arrifiedChildren.length;
  // 循环 child 的当前元素
  let element = null;
  // 包装后的 fiber 节点
  let newFiber = null;
  // 前一个 fiber
  let prevFiber = null;
  // 备份元素
  let alternate = null;

  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child;
  }

  while (index < numberOfElements) {
    element = arrifiedChildren[index];
    if (element && alternate) {
      /* 更新 */
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "update",
        stateNode: null,
        parent: fiber,
        alternate,
      };
      if (element.type === alternate.type) {
        /* 类型相同 */
        newFiber.stateNode = alternate.stateNode;
      } else {
        /* 类型不同 */
        newFiber.stateNode = createStateNode(newFiber);
      }
    } else if (element && !alternate) {
      // 初始渲染
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "placement",
        stateNode: null,
        parent: fiber,
      };
      newFiber.stateNode = createStateNode(newFiber);
      console.log("newFiber:", newFiber);
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }
    if (alternate && alternate.sibling) {
      alternate = alternate.sibling;
    } else {
      alternate = null;
    }

    prevFiber = newFiber;

    index++;
  }
};
const executeTask = (fiber) => {
  if (fiber.tag === "class_component") {
    reconcileChildren(fiber, fiber.stateNode.render());
  } else if (fiber.tag === "function_component") {
    reconcileChildren(fiber, fiber.stateNode(fiber.props));
  } else {
    reconcileChildren(fiber, fiber.props.children);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let currentExecutelyFiber = fiber;
  while (currentExecutelyFiber.parent) {
    let effects = currentExecutelyFiber.parent.effects || [];
    currentExecutelyFiber.parent.effects = effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    );

    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling;
    }
    currentExecutelyFiber = currentExecutelyFiber.parent;
  }
  pendingCommit = currentExecutelyFiber;
};
const workLoop = (deadline) => {
  if (!subTask) {
    subTask = getFirstTask();
  }
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask);
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
};

const performTask = (deadline) => {
  workLoop(deadline);
  if (subTask || taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
};
export const render = (element, dom) => {
  /* 
    1. 向任务队列中添加任务
    2. 指定在浏览器空闲时执行任务
  */
  /* 
    任务就是通过 vdom 对象，构建 fiber 对象
   */
  taskQueue.push({
    dom,
    props: { children: element },
  });
  requestIdleCallback(performTask);
};
