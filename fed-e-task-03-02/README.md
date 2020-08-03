# 刘惠俊 Part3 模块二 Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化 作业

## 一、简答题

### 1、请简述 Vue 首次渲染的过程
+ 答：首次渲染过程——Vue.prototype._init
+ 首次渲染主要流程如下：
  + 1、初始化实例成员：
    + initMixin(Vue)
    + stateMixin(Vue)
    + eventsMixin(Vue)
    + lifecycleMixin(Vue)
    + renderMixin(Vue)
  + 2、初始化静态成员：
    + initGlobalAPI(Vue)
  + 3、调用 _init() 方法：this._init(options) 即 Vue.prototype._init
    + **Vue.prototype._init** 源码文件见 src/core/instance/init.js
    ```js
    export function initMixin(Vue: Class < Component > ) {
        // 给 Vue 实力增加 init() 方法
        // 合并 options 并且初始化操作
        Vue.prototype._init = function(options ? : Object) {
            ...
            // 如果是 Vue 实例不需要被 observe
            vm._isVue = true
                // merge options
            if (options && options._isComponent) {
                initInternalComponent(vm, options)
            } else {
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                )
            }
            /* istanbul ignore else */
            if (process.env.NODE_ENV !== 'production') {
                initProxy(vm)
            } else {
                vm._renderProxy = vm
            }
            // expose real self
            vm._self = vm
                // vm 的生命周期相关变量初始化
                // $children/$parent/$root/$refs
            initLifecycle(vm)
                // vm 的事件监听初始化，父组件绑定在当前组件上的事件
            initEvents(vm)
                // vm 的编译 render 初始化
                // $slot/$scopedSlots/_c/$createElement/$attrs/$listenrs
            initRender(vm)
                // beforeCreate 生命钩子的回调
            callHook(vm, 'beforeCreate')
                // 把 inject 的成员注入到 vm 上
            initInjections(vm) // resolve injections before data/props
                // 初始化 vm 的 _props/methods/_data/computed/watch
            initState(vm)
                // 初始化 provide
            initProvide(vm) // resolve provide after data/props
                // created 生命钩子的回调
            callHook(vm, 'created')
            ...
            if (vm.$options.el) {
                // 调用 mount 方法（重点）
                vm.$mount(vm.$options.el)
            }
        }
    }
    ```
    + **vm.$mount** (重写 $mount 方法的主要作用就是 compiler template) 方法源码如下，文件见 src/platform/web/entry-runtime-with-compiler.js ：
    ```js
    const mount = Vue.prototype.$mount
    Vue.prototype.$mount = function(
        el ? : string | Element,
        // 非 ssr 情况下为 false, ssr 时候为 true
        hydrating ? : boolean
    ): Component {
        // 获取 el 对象
        el = el && query(el)
        ...
        const options = this.$options
            // resolve template/el and convert to render function
        if (!options.render) {
            let template = options.template
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template)
                            /* istanbul ignore if */
                        if (process.env.NODE_ENV !== 'production' && !template) {
                            warn(
                                `Template element not found or is empty: ${options.template}`,
                                this
                            )
                        }
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        warn('invalid template option:' + template, this)
                    }
                    return this
                }
            } else if (el) {
                template = getOuterHTML(el)
            }
            if (template) {
                ...
                const { render, staticRenderFns } = compileToFunctions(template, {
                    outputSourceRange: process.env.NODE_ENV !== 'production',
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                }, this)
                options.render = render
                options.staticRenderFns = staticRenderFns
                ...
            }
        }
        // 调用 mount 方法，渲染 DOM
        return mount.call(this, el, hydrating)
    }
    ```
    + **Vue.prototype.$mount**(这个方法在 runtime-with-compiler 的时候会被重写) 方法源码如下，文件见 src/platforms/web/runtime/index.js：
    ```js
    Vue.prototype.$mount = function(
        el ? : string | Element,
        hydrating ? : boolean
    ): Component {
        el = el && inBrowser ? query(el) : undefined
        return mountComponent(this, el, hydrating)
    }
    ```
    + **mountComponent** 方法源码如下，文件见 src/core/instance/lifecycle.js：
    ```js
    export function mountComponent (
      vm: Component,
      el: ?Element,
      hydrating?: boolean
    ): Component {
      vm.$el = el
      if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode
      }
      callHook(vm, 'beforeMount')

      let updateComponent
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        updateComponent = () => {
          const name = vm._name
          const id = vm._uid
          const startTag = `vue-perf-start:${id}`
          const endTag = `vue-perf-end:${id}`

          mark(startTag)
          const vnode = vm._render()
          mark(endTag)
          measure(`vue ${name} render`, startTag, endTag)

          mark(startTag)
          vm._update(vnode, hydrating)
          mark(endTag)
          measure(`vue ${name} patch`, startTag, endTag)
        }
      } else {
        updateComponent = () => {
          vm._update(vm._render(), hydrating)
        }
      }
      new Watcher(vm, updateComponent, noop, {
        before () {
          if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
          }
        }
      }, true /* isRenderWatcher */)
      hydrating = false
      if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
      }
      return vm
    }
    ```
      + 在 mountComponent 方法中我们定义了 updateComponent 方法，这个方法的调用在 new Watcher 的实例中调用。
        + 创建 Watcher 实例，同时 Watcher 类里的 constructor 里的 this.value 会调用 this.get 方法, 然后调用 pushTarget(this) 将当前 watcher 赋值给 Dep.target，然后执行 updateComponent()
        + updateComponent 中的 vm._update(vm._render(), hydrating) 将虚拟 DOM 转换成真实 DOM
        + vm._update() 中的参数 vm._render() 生成虚拟 DOM
    + 然后触发了生命周期的钩子函数 mounted, 挂载结束，最终返回 Vue 实例。

+ 首次渲染的流程图见：
![](../images/首次渲染过程.png)
+ 收集依赖的流程图见：
![](../images/依赖收集流程.png)


### 2、请简述 Vue 响应式原理。
+ 答：在初始化 Vue 实例的过程中的 _init 方法中会调用 initState(vm)，
  + initState(vm) 方法的作用是：初始化 vm 的 _props/methods/_data/computed/watch
  + 调用 initData() 把 data 属性注入到 Vue 实例上，并且调用 observe(data) 将 data 对象转化成响应式的对象。
  + observe(value) 的功能是:
    + 判断 value 是否是对象，如果不是对象直接返回
    + 判断 value 对象是否有 __ob__，如果有直接返回
    + 如果没有，创建 observer 对象( new Observer(value) )
    + 返回 observer 对象
  + Observe 类的作用是：
    + 给 value 对象定义不可枚举的 __ob__ 属性，记录当前的 observer 对象
    + 数组的响应式处理
    + 对象的响应式处理，调用 walk 方法，walk 方法就是遍历对象的每一个属性，对每个属性调用 defineReactive 方法
  + defineReactive 的作用是：
    + 为每一个属性创建 dep 对象
    + 如果当前属性的值是对象，调用 observe
    + 定义 getter
      + 收集依赖
      + 返回属性的值
    + 定义 setter
      + 保存新值
      + 如果新值是对象，调用 observe
      + 派发更新(发送通知)，调用 dep.notify()
  + 依赖收集：
    + 在 watcher 对象的 get 方法中调用 pushTarget 记录 Dep.target 属性
    + 访问 data 中的成员的时候收集依赖，defineReactive 的 getter 中收集依赖
    + 把属性对应的 watcher 对象添加到 dep 的 subs 数组中
    + 给 childOb 收集依赖，目的是子对象添加和删除成员时发送通知
  + 收集依赖的流程图见：![](../images/依赖收集流程.png)
  + Watcher：
	+ dep.notify() 在调用 watcher 对象的 update() 方法
	+ queueWatcher() 判断 watcher 是否被处理，如果没有的话添加到 queue 队列中，被调用 flushSchedulerQueue()
	+ flushSchedulerQueue()
		+ 触发 beforeUpdate 钩子函数
		+ 调用 watcher.run()
			+ run()-->get()-->getter()-->updateComponent
		+ 清空上一次的依赖
		+ 触发 actived 钩子函数
		+ 触发 updated 钩子函数
+ 整个流程图如下：
![](../images/响应式处理过程.png)

### 3、请简述虚拟 DOM 中 Key 的作用和好处。
+ 答：在 diff 算法中 使用 key 时的比较：
  + oldKeyToIdx为未定义时，由 key 生成 index 表，具体实现为 createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)，createKeyToOldIdx 的代码如下：
    ```js
    function createKeyToOldIdx(children: Array<VNode>, beginIdx: number, endIdx: number): KeyToIndexMap {
      let i: number, map: KeyToIndexMap = {}, key: Key | undefined, ch;
      for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
          key = ch.key;
          if (key !== undefined) map[key] = i;
        }
      }
      return map;
    }
    ```
  + createKeyToOldIdx 方法，用以将 oldCh 中的 key 属性作为键，而对应的节点的索引作为值。然后再判断在 newStartVnode 的属性中是否有 key，且是否在 oldKeyToIndx 中找到对应的节点。
    + 如果不存在这个 key，那么就将这个 newStartVnode 作为新的节点创建且插入到原有的 root 的子节点中，然后将 newStartVnode 替换为此节点的下一个兄弟节点。
    + 如果存在这个key，那么就取出 oldCh 中的存在这个 key 的 vnode，然后再进行 diff 的过程，并将 newStartVnode 替换为此节点的下一个兄弟节点。
+ 好处：在 diff 的时候，如果 newStartVnode 的属性中是否有 key, 如果也设置了 key 的话，那么就根据 newStartVnode 中的 key 在 createKeyToOldIdx 这个函数返回的 map 表中取出 oldCh 中的存在这个 key 的 vnode，然后再进行 diff 的过程。这样能减少 diff 的比较，同时设置 key 比不设置 key 的 DOM 操作要少很多，会优化 DOM 操作。
### 4、请简述 Vue 
+ 答：编译过程的入口函数 compileToFunctions 是先从缓存中加载编译好的 render 函数，如果缓存中没有的话，就去调用 compile 函数，在compile 函数中，首先去合并选项，然后调用 baseCompile 函数编译模板。把模板合并好的选项传递给 baseCompile ，baseCompile 里面完成了模板编译核心的三件事，首先调用 parse 函数把模板转换成 AST 抽象语法树，然后调用 optimize 函数对抽象语法树进行优化，标记静态语法树中的静态根节点（只包含纯文本的静态节点不是静态根节点，因为此时的优化成本大于收益），patch 过程中会跳过静态根节点，最后调用 generate 函数，将 AST 对象转化为 js 形式的代码。当 compile 执行完毕后，会回到编译的入口函数 compileToFunctions ，通过调用 createFunction 函数，继续把上一步中生成的字符串形式 JS 代码转化为函数形式。当 render 和 staticRenderFns 初始化完毕，挂载到 Vue 实例的 options 对应的属性上。
+ ![](../images/09.jpeg)