## 课程介绍
+ Fiber：解决了在计算量很大的情况下，JS 单线程导致的动画卡顿和交互不友好的问题
### 1. React API:
  + createElement
  + createContext
  + JSX => JS
  + ConcurrentMode
  + Ref
  + Component
  + Suspense
  + Hooks
### 2. React 中的更新创建:
  + ReactDOM.render
  + Fiber
  + UpdateQueue
  + FiberRoot
  + Update
  + expirationTime
### 3. Fiber Scheduler:
  + scheduleWork
  + batchedUpdates
  + performWork
  + performUnitOfWork
  + requestWork
  + react scheduler
  + renderRoot
### 4. 开始更新：
  + beginWork 以及优化
  + 各类组件的更新过程
  + 调和子节点的过程
### 5. 完成各个节点的更新：
  + completeUnitOfWork
  + completeWork
  + unwindWork
  + 虚拟 DOM 对你
  + 错误捕获处理
  + 完成整棵树更新
### 6. 提交更新：
  + commitRoot 整体流程
  + 提交快照
  + 提交 DOM 更新
  + 提交所有生命周期
  + 开发时的帮助方法
  + 提交 DOM 插入
  + 提交 DOM 删除
### 7. 各种功能的实现过程:
  + context 的实现过程
  + ref 的实现过程
  + hydrate 的实现过程
  + React 的事件体系
### 8. Suspense:
  + 更新优先级的概念
  + 更新挂起的概念
  + Suspense 组件更新
  + timeout 处理
  + retry 重新尝试渲染
  + lazy 组件更新
### 9. Hooks:
  + 核心原理
  + useState
  + useEffect
  + useContext
  + 其它 Hooks API
## React API:
  ### ../react/packages/react/src/React.js
    + React 的定义
    ```js
    const React = {
      Children: {
        map,
        forEach,
        count,
        toArray,
        only,
      },

      createRef,
      Component,
      PureComponent,

      createContext,
      forwardRef,
      lazy,
      memo,

      Fragment: REACT_FRAGMENT_TYPE,
      StrictMode: REACT_STRICT_MODE_TYPE,
      Suspense: REACT_SUSPENSE_TYPE,

      createElement: __DEV__ ? createElementWithValidation : createElement,
      cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
      createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
      isValidElement: isValidElement,

      version: ReactVersion,

      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
    };
    ```
  ### ../react/packages/react/src/ReactElement.js
    + createElement 方法
    ```js
    export function createElement(type, config, children) {
      let propName;

      // Reserved names are extracted
      const props = {};

      let key = null;
      let ref = null;
      let self = null;
      let source = null;

      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
          if (
            hasOwnProperty.call(config, propName) &&
            !RESERVED_PROPS.hasOwnProperty(propName)
          ) {
            props[propName] = config[propName];
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      const childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        const childArray = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        if (__DEV__) {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }
        props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      if (__DEV__) {
        if (key || ref) {
          const displayName =
            typeof type === 'function'
              ? type.displayName || type.name || 'Unknown'
              : type;
          if (key) {
            defineKeyPropWarningGetter(props, displayName);
          }
          if (ref) {
            defineRefPropWarningGetter(props, displayName);
          }
        }
      }
      return ReactElement(
        type,
        key,
        ref,
        self,
        source,
        ReactCurrentOwner.current,
        props,
      );
    }
    ```
      + ReactElement 方法：
        ```js
        const ReactElement = function(type, key, ref, self, source, owner, props) {
          const element = {
            // This tag allows us to uniquely identify this as a React Element
            // 一般的 $$typeof 都是 REACT_ELEMENT_TYPE,但 portals 的 $$typeof 是 REACT_PORTAL_TYPE
            // ReactDOM.createPortal 不是通过createElement创建的，所以他也不属于ReactElemen
            $$typeof: REACT_ELEMENT_TYPE,

            // Built-in properties that belong on the element
            type: type,
            key: key,
            ref: ref,
            props: props,

            // Record the component responsible for creating this element.
            _owner: owner,
          };

          if (__DEV__) {
            // The validation flag is currently mutative. We put it on
            // an external backing store so that we can freeze the whole object.
            // This can be replaced with a WeakMap once they are implemented in
            // commonly used development environments.
            element._store = {};

            // To make comparing ReactElements easier for testing purposes, we make
            // the validation flag non-enumerable (where possible, which should
            // include every environment we run tests in), so the test framework
            // ignores it.
            Object.defineProperty(element._store, 'validated', {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false,
            });
            // self and source are DEV only properties.
            Object.defineProperty(element, '_self', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self,
            });
            // Two elements created in two different places should be considered
            // equal for testing purposes and therefore we hide it from enumeration.
            Object.defineProperty(element, '_source', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source,
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }

          return element;
        };
        ```
  ### ../react/packages/react/src/ReactBaseClass.js
    + Component 方法：
      ```js
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        // If a component has string refs, we will assign a different object later.
        this.refs = emptyObject;
        // We initialize the default updater but the real one gets injected by the
        // renderer.
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.setState = function(partialState, callback) {
        invariant(
          typeof partialState === 'object' ||
            typeof partialState === 'function' ||
            partialState == null,
          'setState(...): takes an object of state variables to update or a ' +
            'function which returns an object of state variables.',
        );
        this.updater.enqueueSetState(this, partialState, callback, 'setState');
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
      };
      ```
    + PureComponent 方法：
      ```js
      function ComponentDummy() {}
      ComponentDummy.prototype = Component.prototype;

      /**
      * Convenience component with default shallow equality check for sCU.
      */
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        // If a component has string refs, we will assign a different object later.
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }

      const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
      pureComponentPrototype.constructor = PureComponent;
      // Avoid an extra prototype jump for these methods.
      Object.assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      ```
  ### ../react/packages/react/src/ReactCreateRef.js
    + createRef 方法：
        ```js
        import type {RefObject} from 'shared/ReactTypes';

        // an immutable object with a single mutable value
        export function createRef(): RefObject {
          const refObject = {
            current: null,
          };
          if (__DEV__) {
            Object.seal(refObject);
          }
          return refObject;
        }
        ```
  ### ../react/packages/react/src/forwardRef.js  
    + forwardRef 方法：
      ```js
      export default function forwardRef<Props, ElementType: React$ElementType>(
        render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
      ) {
        if (__DEV__) {
          ...
        }

        return {
          $$typeof: REACT_FORWARD_REF_TYPE,
          render,
        };
      }
      ```
  ### ../react/packages/react/src/ReactContext.js
    + Context 方法：
      ```js
      export function createContext<T>(
        defaultValue: T,
        calculateChangedBits: ?(a: T, b: T) => number,
      ): ReactContext<T> {
        if (calculateChangedBits === undefined) {
          calculateChangedBits = null;
        } else {
          if (__DEV__) {
            warningWithoutStack(
              calculateChangedBits === null ||
                typeof calculateChangedBits === 'function',
              'createContext: Expected the optional second argument to be a ' +
                'function. Instead received: %s',
              calculateChangedBits,
            );
          }
        }

        const context: ReactContext<T> = {
          $$typeof: REACT_CONTEXT_TYPE,
          _calculateChangedBits: calculateChangedBits,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          // These are circular
          Provider: (null: any),
          Consumer: (null: any),
        };

        context.Provider = {
          $$typeof: REACT_PROVIDER_TYPE,
          _context: context,
        };

        let hasWarnedAboutUsingNestedContextConsumers = false;
        let hasWarnedAboutUsingConsumerProvider = false;

        if (__DEV__) {
          // A separate object, but proxies back to the original context object for
          // backwards compatibility. It has a different $$typeof, so we can properly
          // warn for the incorrect usage of Context as a Consumer.
          const Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context,
            _calculateChangedBits: context._calculateChangedBits,
          };
          // $FlowFixMe: Flow complains about not setting a value, which is intentional here
          Object.defineProperties(Consumer, {
            Provider: {
              get() {
                if (!hasWarnedAboutUsingConsumerProvider) {
                  hasWarnedAboutUsingConsumerProvider = true;
                  warning(
                    false,
                    'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' +
                      'a future major release. Did you mean to render <Context.Provider> instead?',
                  );
                }
                return context.Provider;
              },
              set(_Provider) {
                context.Provider = _Provider;
              },
            },
            _currentValue: {
              get() {
                return context._currentValue;
              },
              set(_currentValue) {
                context._currentValue = _currentValue;
              },
            },
            _currentValue2: {
              get() {
                return context._currentValue2;
              },
              set(_currentValue2) {
                context._currentValue2 = _currentValue2;
              },
            },
            Consumer: {
              get() {
                if (!hasWarnedAboutUsingNestedContextConsumers) {
                  hasWarnedAboutUsingNestedContextConsumers = true;
                  warning(
                    false,
                    'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' +
                      'a future major release. Did you mean to render <Context.Consumer> instead?',
                  );
                }
                return context.Consumer;
              },
            },
          });
          // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
          context.Consumer = Consumer;
        } else {
          context.Consumer = context;
        }

        if (__DEV__) {
          context._currentRenderer = null;
          context._currentRenderer2 = null;
        }

        return context;
      }
      ```

## React 中的更新创建：
### 创建更新的方式：
  + ReactDOM.render || hydrate
    + 创建 ReactRoot
    + 创建 FiberRoot 和 RootFiber
    + 创建更新
  + setState
  + forceUpdate
### ReactDOM.render 方法：
+ ../react/packages/react-dom/src/client/ReactDOM.js
  ```js
  const ReactDOM: Object = {
    createPortal,

    ...
    hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {
      // TODO: throw or warn if we couldn't hydrate?
      return legacyRenderSubtreeIntoContainer(
        null,
        element,
        container,
        true,
        callback,
      );
    },

    render(
      element: React$Element<any>,
      container: DOMContainer,
      callback: ?Function,
    ) {
      return legacyRenderSubtreeIntoContainer(
        null,
        element,
        container,
        false,
        callback,
      );
    },
    ...
  };
  ```
  + legacyRenderSubtreeIntoContainer 方法：
    ```js
    function legacyRenderSubtreeIntoContainer(
      parentComponent: ?React$Component<any, any>,
      children: ReactNodeList,
      container: DOMContainer,
      forceHydrate: boolean,
      callback: ?Function,
    ) {
      // TODO: Ensure all entry points contain this check
      invariant(
        isValidContainer(container),
        'Target container is not a DOM element.',
      );

      if (__DEV__) {
        topLevelUpdateWarnings(container);
      }

      // TODO: Without `any` type, Flow says "Property cannot be accessed on any
      // member of intersection type." Whyyyyyy.
      let root: Root = (container._reactRootContainer: any);
      if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
          container,
          forceHydrate,
        );
        if (typeof callback === 'function') {
          const originalCallback = callback;
          callback = function() {
            const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
            originalCallback.call(instance);
          };
        }
        // Initial mount should not be batched.
        DOMRenderer.unbatchedUpdates(() => {
          if (parentComponent != null) {
            root.legacy_renderSubtreeIntoContainer(
              parentComponent,
              children,
              callback,
            );
          } else {
            root.render(children, callback);
          }
        });
      } else {
        if (typeof callback === 'function') {
          const originalCallback = callback;
          callback = function() {
            const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
            originalCallback.call(instance);
          };
        }
        // Update
        if (parentComponent != null) {
          root.legacy_renderSubtreeIntoContainer(
            parentComponent,
            children,
            callback,
          );
        } else {
          root.render(children, callback);
        }
      }
      return DOMRenderer.getPublicRootInstance(root._internalRoot);
    }
    ```
    + legacyCreateRootFromDOMContainer 的方法：
      ```js
      function legacyCreateRootFromDOMContainer(
        container: DOMContainer,
        forceHydrate: boolean,
      ): Root {
        ...
        // Legacy roots are not async by default.
        const isConcurrent = false;
        return new ReactRoot(container, isConcurrent, shouldHydrate);
      }
      ```
      + ReactRoot 的方法：
        ```js
        function ReactRoot(
          container: Container,
          isConcurrent: boolean,
          hydrate: boolean,
        ) {
          const root = DOMRenderer.createContainer(container, isConcurrent, hydrate);
          this._internalRoot = root;
        }
        ```
      + DOMRenderer.createContainer(../react/packages/react-reconciler/src/ReactFiberReconciler.js)
        ```js
        export function createContainer(
          containerInfo: Container,
          isConcurrent: boolean,
          hydrate: boolean,
        ): OpaqueRoot {
          return createFiberRoot(containerInfo, isConcurrent, hydrate);
        }
        ```
      + root.render(children, callback);
        ```js
        ReactRoot.prototype.render = function(
          children: ReactNodeList,
          callback: ?() => mixed,
        ): Work {
          const root = this._internalRoot;
          const work = new ReactWork();
          callback = callback === undefined ? null : callback;
          if (__DEV__) {
            warnOnInvalidCallback(callback, 'render');
          }
          if (callback !== null) {
            work.then(callback);
          }
          DOMRenderer.updateContainer(children, root, null, work._onCommit);
          return work;
        };
        ```
        + DOMRenderer.updateContainer(children, root, null, work._onCommit);
          ```js
          export function updateContainer(
            element: ReactNodeList,
            container: OpaqueRoot,
            parentComponent: ?React$Component<any, any>,
            callback: ?Function,
          ): ExpirationTime {
            const current = container.current;
            const currentTime = requestCurrentTime();
            const expirationTime = computeExpirationForFiber(currentTime, current);
            return updateContainerAtExpirationTime(
              element,
              container,
              parentComponent,
              expirationTime,
              callback,
            );
          }
          ```
            + updateContainerAtExpirationTime 方法：
              ```js
              export function updateContainerAtExpirationTime(
                element: ReactNodeList,
                container: OpaqueRoot,
                parentComponent: ?React$Component<any, any>,
                expirationTime: ExpirationTime,
                callback: ?Function,
              ) {
                。。。
                return scheduleRootUpdate(current, element, expirationTime, callback);
              }
              ```
              + scheduleRootUpdate 方法
                ```js
                function scheduleRootUpdate(
                  current: Fiber,
                  element: ReactNodeList,
                  expirationTime: ExpirationTime,
                  callback: ?Function,
                ) {
                  

                  const update = createUpdate(expirationTime);
                  // Caution: React DevTools currently depends on this property
                  // being called "element".
                  update.payload = {element};

                  callback = callback === undefined ? null : callback;
                  if (callback !== null) {
                    warningWithoutStack(
                      typeof callback === 'function',
                      'render(...): Expected the last optional `callback` argument to be a ' +
                        'function. Instead received: %s.',
                      callback,
                    );
                    update.callback = callback;
                  }
                  enqueueUpdate(current, update);

                  scheduleWork(current, expirationTime);
                  return expirationTime;
                }
                ```
### 什么是 FiberRoot:
  + 整个应用的起点
  + 包含应用挂载的目标节点
  + 记录整个应用更新过程的各种信息
  + ../react/packages/react-reconciler/src/ReactFiberRoot.js
    + createFiberRoot 方法：
      ```js
      export function createFiberRoot(
        containerInfo: any,
        isConcurrent: boolean,
        hydrate: boolean,
      ): FiberRoot {
        // Cyclic construction. This cheats the type system right now because
        // stateNode is any.
        const uninitializedFiber = createHostRootFiber(isConcurrent);

        let root;
        if (enableSchedulerTracing) {
          root = ({
            current: uninitializedFiber,
            containerInfo: containerInfo,
            pendingChildren: null,

            earliestPendingTime: NoWork,
            latestPendingTime: NoWork,
            earliestSuspendedTime: NoWork,
            latestSuspendedTime: NoWork,
            latestPingedTime: NoWork,

            didError: false,

            pendingCommitExpirationTime: NoWork,
            finishedWork: null,
            timeoutHandle: noTimeout,
            context: null,
            pendingContext: null,
            hydrate,
            nextExpirationTimeToWorkOn: NoWork,
            expirationTime: NoWork,
            firstBatch: null,
            nextScheduledRoot: null,

            interactionThreadID: unstable_getThreadID(),
            memoizedInteractions: new Set(),
            pendingInteractionMap: new Map(),
          }: FiberRoot);
        } else {
          root = ({
            current: uninitializedFiber,
            containerInfo: containerInfo,
            pendingChildren: null,

            earliestPendingTime: NoWork,
            latestPendingTime: NoWork,
            earliestSuspendedTime: NoWork,
            latestSuspendedTime: NoWork,
            latestPingedTime: NoWork,

            didError: false,

            pendingCommitExpirationTime: NoWork,
            finishedWork: null,
            timeoutHandle: noTimeout,
            context: null,
            pendingContext: null,
            hydrate,
            nextExpirationTimeToWorkOn: NoWork,
            expirationTime: NoWork,
            firstBatch: null,
            nextScheduledRoot: null,
          }: BaseFiberRootProperties);
        }

        uninitializedFiber.stateNode = root;

        // The reason for the way the Flow types are structured in this file,
        // Is to avoid needing :any casts everywhere interaction tracing fields are used.
        // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
        // $FlowFixMe Remove this :any cast and replace it with something better.
        return ((root: any): FiberRoot);
      }
      ```
### Fiber:
  + 每一个 ReactElement 都对应一个 Fiber 对象
  + 记录节点的各种状态
  + 串联整个应用形成树结构

## Fiber Scheduler:
### ../react/packages/react-reconciler/src/ReactFiberScheduler.js
  + scheduleWork 方法：
    + 找到更新对应的 FiberRoot 节点
    + 如果符合条件重置 stack
    + 如果符合条件就请求工作调度
    ```js
    function scheduleWork(fiber: Fiber, expirationTime: ExpirationTime) {
      const root = scheduleWorkToRoot(fiber, expirationTime);
      if (root === null) {
        return;
      }

      if (
        !isWorking &&
        nextRenderExpirationTime !== NoWork &&
        expirationTime < nextRenderExpirationTime
      ) {
        // This is an interruption. (Used for performance tracking.)
        interruptedBy = fiber;
        resetStack();
      }
      markPendingPriorityLevel(root, expirationTime);
      if (
        // If we're in the render phase, we don't need to schedule this root
        // for an update, because we'll do it before we exit...
        !isWorking ||
        isCommitting ||
        // ...unless this is a different root than the one we're rendering.
        nextRoot !== root
      ) {
        const rootExpirationTime = root.expirationTime;
        requestWork(root, rootExpirationTime);
      }
      if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
        // Reset this back to zero so subsequent updates don't throw.
        nestedUpdateCount = 0;
        invariant(
          false,
          'Maximum update depth exceeded. This can happen when a ' +
            'component repeatedly calls setState inside ' +
            'componentWillUpdate or componentDidUpdate. React limits ' +
            'the number of nested updates to prevent infinite loops.',
        );
      }
    }
    ```
### requestWork:
  + 加入到 root 调度队列
  + 判断是否是批量更新
  + 根据 expirationTime 判断调度类型
### batchedUpdates:
+ 示例代码：
  ```js
  import React from 'react'
  import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'

  export default class BatchedDemo extends React.Component {
    state = {
      number: 0,
    }

    handleClick = () => {
      // 主动`batchedUpdates`
      // setTimeout(() => {
      //   this.countNumber()
      // }, 0)

      // setTimeout中没有`batchedUpdates`
      setTimeout(() => {
        batchedUpdates(() => this.countNumber())
      }, 0)

      // 事件处理函数自带`batchedUpdates`
      // this.countNumber()
    }

    countNumber() {
      const num = this.state.number
      this.setState({
        number: num + 1,
      })
      console.log(this.state.number)
      this.setState({
        number: num + 2,
      })
      console.log(this.state.number)
      this.setState({
        number: num + 3,
      })
      console.log(this.state.number)
    }

    render() {
      return <button onClick={this.handleClick}>Num: {this.state.number}</button>
    }
  }
  ```
### reactScheduler:
  + 维护时间片
  + 模拟 requestIdleCallback 
  + 调度列表和超时判断
### performWork:
  + 是否有 deadline 的区分
  + 循环渲染 Root 的条件
  + 超过时间片的处理
### renderRoot:
  + 调用 workLoop 进行循环单元更新
  + 捕获错误并进行处理
  + 走完流程之后进行善后处理
### currentTime:
  + 在一次渲染中产生的更新需要使用相同的时间
  + 一次批处理的更新应该得到相同的时间
  + 挂起任务用于记录的时候应该相同

## 开始更新：
### 入口和优化：
  + 判断组件更新是否可以优化
  + 根据节点类型分发处理
  + 根据 expirationTime 来判断是否可以跳过
### reconcilerChildren:
  + 根据 props.children 生成 Fiber 子树
  + 判断 Fiber 对象是否可以复用
  + 列表根据 key 优化
  + Fiber 的 type (fiberTag) :
    1. REACT_FRAGMENT_TYPE
    2. REACT_CONCURRENT_MODE_TYPE
    3. REACT_STRICT_MODE_TYP
    4. REACT_PROFILER_TYPE
    5. REACT_SUSPENSE_TYPE
    6. REACT_PROVIDER_TYPE
    7. REACT_CONTEXT_TYPE
    8. REACT_FORWARD_REF_TYPE
    9. REACT_MEMO_TYPE
    10. REACT_LAZY_TYPE
### reconcilerChildren-array:
  + key 的作用
  + 对比数组 children 是否可复用
  + generator 和 Array 的区别
### Mode 组件的更新：
  + ConCurrentmode
  + StrictMode

## 完成各个节点的更新：
### completeUnitOfWork 的整体流程和意义：
  + 根据是否中断调用不同的处理方法
  + 判断是否有兄弟节点来执行不同的操作
  + 完成节点之后赋值 effect 链
### completeWork:
  + pop 各种 context 相关的内容
  + 对于 hostComponent 执行初始化
  + 初始化监听事件
### 初次渲染中 completeWork 对于 DOM 节点的创建和 appendAllChild 算法：
  + diffProperties 计算需要更新的内容
  + 不同的 dom property 处理方式不同

## hooks:
  + useState
  + useEffect
  + useContext
  + useReducer
  + useLayoutEffect
  + useCallback
  + useMemo
  + useRef
  + useImperativeHandle




