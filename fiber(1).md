## 「译」React Fiber 那些事: 深入解析新的协调算法
+ 翻译自：[Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)

+ React 是一个用于构建用户交互界面的 JavaScript 库，其核心 机制 就是跟踪组件的状态变化，并将更新的状态映射到到新的界面。在 React 中，我们将此过程称之为协调。我们调用 setState 方法来改变状态，而框架本身会去检查 state 或 props 是否已经更改来决定是否重新渲染组件。

+ React 的官方文档对 协调机制 进行了良好的抽象描述： React 的元素、生命周期、 render 方法，以及应用于组件子元素的 diffing 算法综合起到的作用，就是协调。从 render 方法返回的不可变的 React 元素通常称为「虚拟 DOM」。这个术语有助于早期向人们解释 React，但它也引起了混乱，并且不再用于 React 文档。在本文中，我将坚持称它为 React 元素的树。

+ 除了 React 元素的树之外，框架总是在内部维护一个实例来持有状态（如组件、 DOM 节点等）。从版本 16 开始， React 推出了内部实例树的新的实现方法，以及被称之为 Fiber 的算法。如果想要了解 Fiber 架构带来的优势，可以看下 [React 在 Fiber 中使用链表的方式和原因](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7) 

+ 这是本系列的第一篇文章，这一系列的目的就是向你描绘出 React 的内部架构。在本文中，我希望能够提供一些与算法相关的重要概念和数据结构，并对其进行深入阐述。一旦我们有足够的背景，我们将探索用于遍历和处理 Fiber 树的算法和主要功能。本系列的下一篇文章将演示 React 如何使用该算法执行初始渲染和处理 state 以及 props 的更新。到那时，我们将继续讨论调度程序的详细信息，子协调过程以及构建 effect 列表的机制。

+ 我将给你带来一些非常高阶的知识 。我鼓励你阅读来了解 Concurrent React 的内部工作的魔力。如果您计划开始为 React 贡献代码，本系列也将为您提供很好的指导。我是 [逆向工程的坚定信徒](https://indepth.dev/level-up-your-reverse-engineering-skills/)，因此本文会有很多最新版本 16.6.0 中的源代码的链接。

+ 需要消化的内容绝对是很多的，所以如果你当下还不能很理解的话，不用感到压力。花些时间是值得的。**请注意，只是使用 React 的话，您不需要知道任何文中的内容。本文是关于 React 在内部是如何工作的。**

### 背景介绍
+ 如下是我将在整个系列中使用的一个简单的应用程序。我们有一个按钮，点击它将会使屏幕上渲染的数字加 1：
  + ![](./images/react示例1.gif)