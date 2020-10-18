import {createTaskQueue, arrified, createStateNode, getTag} from '../Misc'

const taskQueue = createTaskQueue()
let subTask = null
let pendingCommit = null

const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.effectTag === 'placement' && item.parent.stateNode) {
      item.parent.stateNode.appendChild(item.stateNode)
    }
  })
}

const getFirstTask = () => {}

const reconcileChildren = (fiber, children) => {
  const arrifiedChildren = arrified(children)
  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null
  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element),
      effects: [],
      effectTag: 'placement',
      stateNode: null,
      parent: fiber
    }
    newFiber.stateNode = createStateNode(newFiber)
    if (index == 0) {
      fiber.child = newFiber
    }else{
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
    
    index++
  }
}
const executeTask = fiber => {
  reconcileChildren(fiber, fiber.props.children)
  if(fiber.child) {
    return fiber.child
  }
  let currentExecutelyFiber = fiber
  while (currentExecutelyFiber.parent) {
    let effects = currentExecutelyFiber.parent.effects || []
    currentExecutelyFiber.parent.effects = effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    currentExecutelyFiber = currentExecutelyFiber.parent
  }
  pendingCommit = currentExecutelyFiber
}
const workLoop = deadline => {
  if (!subTask) {
    subTask = getFirstTask()
  }
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

const performTask = deadline => {
  workLoop(deadline)
  if (subTask || taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}
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
    props: {children: element}
  })
subTask = taskQueue.pop()
  requestIdleCallback(performTask)
}