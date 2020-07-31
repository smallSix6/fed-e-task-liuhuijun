## Vue.js 源码分析（响应式、虚拟 DOM、模板编译和组件化）项目见：<https://github.com/smallSix6/fed-e-task-liuhuijun/tree/master/fed-e-task-03-02>

### 任务一：Vue.js 源码剖析-响应式原理
#### 1、Vue 的不同构建版本
+ ![avatar](../images/vueAllJs.png)
+ Full：包含编译器和运行时的构建。
+ 编译器：负责将模板字符串编译为JavaScript渲染函数的代码。
+ 运行时：负责创建Vue实例，渲染和修补虚拟DOM等的代码。基本上，所有内容都减去编译器。
+ UMD：UMD构建可通过script标签直接在浏览器中使用。来自 <https://unpkg.com/vue> 的 Unpkg CDN的默认文件是Runtime + Compiler UMD构建（vue.js）。
+ CommonJS的：CommonJS的建立旨在用于与旧捆扎机像 browserify或的WebPack 1。这些捆绑器（pkg.main）的默认文件是“仅运行时” CommonJS构建（vue.runtime.common.js）。
+ ES模块：ES模块版本旨在与现代捆绑器（例如 webpack 2或汇总）一起使用。这些捆绑程序（pkg.module）的默认文件是“仅运行时ES模块”构建（vue.runtime.esm.js）。

#### 2、入口文件
+ 寻找入口文件
  + 查看 dist/vue.js 的构建过程
+ 执行构建
```js
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```
  + script/config.js 的执行过程
    + 作用：生成 rollup 构建的配置文件
    + 使用环境变量 TARGET=web-full-de
    ```js
    // 判断环境变量是否有 TARGET
    // 如果有的话，使用 gitConfig() 生成 rollup 配置文件
    if (process.env.TARGET) {
        module.exports = genConfig(process.env.TARGET)
    } else {
        exports.getBuild = genConfig
        exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
    }
    ```
  + 最后生成 src/platforms/web/entry-runtime-with-compiler.js 文件
+ 通过查看源码解决下面问题
  + 观察以下代码，通过阅读源码，回答在页面上输出的结果
  ```js
  const vm = new Vue({
    el: '#app'
    template: '<h3> Hello Template </h3>,
    render (h) {
      return h('h4', 'Hello Render')
    }
  })
  ```
+ 阅读源码记录
  + el 不能是 body 或者 html 标签
  + 如果没有 render, 把 template 转换成 render 函数
  + 如果有 render 方法，直接调用 mount 挂载 DOM
```js
Vue.prototype.$mount = function(
    el ? : string | Element,
    // 非 ssr 情况下为 false, ssr 时候为 true
    hydrating ? : boolean
): Component {
    // 获取 el 对象
    el = el && query(el)

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
        process.env.NODE_ENV !== 'production' && warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
    }

    const options = this.$options
        // resolve template/el and convert to render function
    if (!options.render) {
       ...
    }
    // 调用 mount 方法，渲染 DOM
    return mount.call(this, el, hydrating)
}
```
+ 页面渲染流程的 Call Stack 为：
  + Vue
  + Vue._init
  + Vue.$mount

#### 3、Vue 初始化的过程
+ 四个导出 Vue 的模块
  + src/platforms/web/entry-runtime-with-compiler.js
    + web 平台相关的入口
    + 重写了平台相关的 $mount() 方法
    + 注册了 Vue.compile() 方法，传递一个 HTML 字符串返回 render 函数
  + src/platforms/web/runtime/index.js
    + web 平台相关
    + 注册和平台相关的全局指令：v-model、v-show
    + 注册和平台相关的全局组件：v-transition、v-transition-group
    + 全局方法：
      + __patch__:把虚拟 DOM 转换成真实 DOM
      + $mount: 挂载方法
  + src/core/index.js
    + 与平台无关
    + 设置了 vue 的静态方法， initGlobalAPI(Vue) 
+ src/core/instance/index.js
    + 与平台无关
    + 定义了构造函数，调用了 this._init(options) 方法
    + 给 Vue 中混入了常用的实例成员
    ```js
    // 此处不用 class 的原因是因为方便后续给 Vue 实例混入实例成员
    function Vue(options) {
        if (process.env.NODE_ENV !== 'production' &&
            !(this instanceof Vue)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword')
        }
        // 调用 _init() 方法
        this._init(options)
    }

    // 注册 vm 的 _init() 方法，初始化 vm
    initMixin(Vue)
        // 注册 vm 的 $data/$props/$set/$delete/$watch
    stateMixin(Vue)
        // 初始化事件相关方法
        // $on/$once/$off/$emit
    eventsMixin(Vue)

    // 初始化生命周期相关的混入方法
    // _update/$forceUpdate/$destroy
    lifecycleMixin(Vue)
        // 混入 render
        // $nextTick/_render
    renderMixin(Vue)

    export default Vue
    ```

#### 4、Vue 初始化——静态成员
+ src/core/global-api/index.js
  + 设置 Vue 的静态方法，initGlobalAPI(Vue)
   ```js
    export function initGlobalAPI(Vue: GlobalAPI) {
        // config
        const configDef = {}
        configDef.get = () => config
        if (process.env.NODE_ENV !== 'production') {
            configDef.set = () => {
                warn(
                    'Do not replace the Vue.config object, set individual fields instead.'
                )
            }
        }
        // 初始化 Vue.config 对象
        // 在 src/platforms/web/runtime/index.js 里设置了 config 属性
        Object.defineProperty(Vue, 'config', configDef)

        // exposed util methods.
        // NOTE: these are not considered part of the public API - avoid relying on
        // them unless you are aware of the risk.
        Vue.util = {
            warn,
            extend,
            mergeOptions,
            defineReactive
        }

        Vue.set = set
        Vue.delete = del
        Vue.nextTick = nextTick

        // 2.6 explicit observable API
        Vue.observable = < T > (obj: T): T => {
            observe(obj)
            return obj
        }

        Vue.options = Object.create(null)
        ASSET_TYPES.forEach(type => {
            Vue.options[type + 's'] = Object.create(null)
        })

        // this is used to identify the "base" constructor to extend all plain-object
        // components with in Weex's multi-instance scenarios.
        Vue.options._base = Vue

        extend(Vue.options.components, builtInComponents)
            // 注册 Vue.use(),用来注册插件
        initUse(Vue)
            // 注册 Vue.mixin() 实现混入    
        initMixin(Vue)
            // 注册 Vue.extend() 基于传入的 options 返回一个组件的构造函数
        initExtend(Vue)
            // 注册 Vue.directive()、Vue.component()、Vue.filter()
        initAssetRegisters(Vue)
    }
    ```
  + initUse(Vue)  注册 Vue.use(),用来注册插件
  ```js
  import { toArray } from '../util/index'
  export function initUse (Vue: GlobalAPI) {
    Vue.use = function (plugin: Function | Object) {
      const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      // 把数组中的第一个元素（plugin）去除
      const args = toArray(arguments, 1)
      // 把 this(vue) 插入第一个元素的位置
      args.unshift(this)
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
      }
      installedPlugins.push(plugin)
      return this
    }
  }
  ```

#### 5、Vue 初始化——实例成员
+ src/core/instance/index.js
```js
// 此处不用 class 的原因是因为方便后续给 Vue 实例混入实例成员
function Vue(options) {
    if (process.env.NODE_ENV !== 'production' &&
        !(this instanceof Vue)
    ) {
        warn('Vue is a constructor and should be called with the `new` keyword')
    }
    // 调用 _init() 方法
    this._init(options)
}

// 注册 vm 的 _init() 方法，初始化 vm
initMixin(Vue)
    // 注册 vm 的 $data/$props/$set/$delete/$watch
stateMixin(Vue)
    // 初始化事件相关方法
    // $on/$once/$off/$emit
eventsMixin(Vue)

// 初始化生命周期相关的混入方法
// _update/$forceUpdate/$destroy
lifecycleMixin(Vue)
    // 混入 render
    // $nextTick/_render
renderMixin(Vue)

export default Vue
```

#### 6、Vue 初始化——实例成员——init
+ initMixin(Vue)   注册 vm 的 _init() 方法，初始化 vm
```js
export function initMixin(Vue: Class < Component > ) {
    // 给 Vue 实力增加 init() 方法
    // 合并 options 并且初始化操作
    Vue.prototype._init = function(options ? : Object) {
        const vm: Component = this
            // a uid
        vm._uid = uid++

            let startTag, endTag
                /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            startTag = `vue-perf-start:${vm._uid}`
            endTag = `vue-perf-end:${vm._uid}`
            mark(startTag)
        }

        // a flag to avoid this being observed
        vm._isVue = true
            // merge options
        if (options && options._isComponent) {
            // optimize internal component instantiation
            // since dynamic options merging is pretty slow, and none of the
            // internal component options needs special treatment.
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

        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            vm._name = formatComponentName(vm, false)
            mark(endTag)
            measure(`vue ${vm._name} init`, startTag, endTag)
        }

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}
```
  + initState(vm)   初始化 vm 的 _props/methods/_data/computed/watch
  ```js
  export function initState (vm: Component) {
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
      initData(vm)
    } else {
      observe(vm._data = {}, true /* asRootData */)
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch)
    }
  }
  ```
#### 7、首次渲染过程——Vue.prototype._init
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
    + Vue.prototype._init 源码文件见 src/core/instance/init.js
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
    + vm.$mount (重写 $mount 方法的主要作用就是 compiler template) 方法源码如下，文件见 src/platform/web/entry-runtime-with-compiler.js ：
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
    + Vue.prototype.$mount(这个方法在 runtime-with-compiler 的时候会被重写) 方法源码如下，文件见 src/platforms/web/runtime/index.js：
    ```js
    Vue.prototype.$mount = function(
        el ? : string | Element,
        hydrating ? : boolean
    ): Component {
        el = el && inBrowser ? query(el) : undefined
        return mountComponent(this, el, hydrating)
    }
    ```
    + mountComponent 方法源码如下，文件见 src/core/instance/lifecycle.js：
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

+ 首次渲染的流程图见：
![](../images/首次渲染过程.png)

#### 8、数据响应式原理——响应式处理入口
+ 通过查看源码解决下面问题
  + vm.msg = { count: 0 }, 重新给属性赋值，是否是响应式的？
  + vm.arr[0] = 4，给数组元素赋值，试图是否会更新
  + vm.arr.length = 0，修改数组的 length，试图是否会更新
  + vm.arr.push(4)，试图是否会更新
+ 响应式处理的入口
  + 整个响应式处理的过程是比较复杂的，下面我们先从入口开始看起
    + src/core/instance/init.js
      + initState(vm)  vm状态的初始化
      + 初始化了 _data、_props、methods 等
    + initData(vm): src/core/instance/state.js
    ```js
    // 数据的初始化
    if (opts.data) {
      initData(vm)
    } else {
      observe(vm._data={}, true  /*  asRootData */)
    }
    ```
    + observe(value: any, asRootData: ? boolean): src/core/observer/index.js
    ```js
    export function observe(value: any, asRootData: ? boolean): Observer | void {
        // 判断 value 是否是对象
        if (!isObject(value) || value instanceof VNode) {
            return
        }
        let ob: Observer | void
            // 如果 value 有 __ob__(observer 对象) 属性  结束
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__
        } else if (
            shouldObserve &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            // 创建一个 Observer 对象
            ob = new Observer(value)
        }
        if (asRootData && ob) {
            ob.vmCount++
        }
        return ob
    }
    ```
    + class Observer:  src/core/observer/index.js
    ```js
    export class Observer {
        // 观测对象
        value: any;
        // 依赖对象
        dep: Dep;
        // 实例计数器
        vmCount: number; // number of vms that have this object as root $data
        constructor(value: any) {
            this.value = value
            this.dep = new Dep()
                // 初始化实例的 vmCount 为0
            this.vmCount = 0
                // 将实例挂载到观察对象的 __ob__ 属性
            def(value, '__ob__', this)
                // 数组的响应式处理
            if (Array.isArray(value)) {
                if (hasProto) {
                    protoAugment(value, arrayMethods)
                } else {
                    copyAugment(value, arrayMethods, arrayKeys)
                }
                // 为数组中的每一个对象创建一个 observer 实例
                this.observeArray(value)
            } else {
                // 遍历对象中的每一个属性，转换成 setter/getter
                this.walk(value)
            }
        }
        /**
        * Walk through all properties and convert them into
        * getter/setters. This method should only be called when
        * value type is Object.
        */
        walk(obj: Object) {
            const keys = Object.keys(obj)
            for (let i = 0; i < keys.length; i++) {
                defineReactive(obj, keys[i])
            }
        }

        /**
        * Observe a list of Array items.
        */
        observeArray(items: Array < any > ) {
            for (let i = 0, l = items.length; i < l; i++) {
                observe(items[i])
            }
        }
    }
    ```
    + defineReactive (为一个对象定义一个响应式的属性): src/core/observer/index.js
    ```js
    export function defineReactive(
        obj: Object,
        key: string,
        val: any,
        customSetter ? : ? Function,
        shallow ? : boolean
    ) {
        // 创建依赖对象实例
        const dep = new Dep()
            // 获取 obj 的属性描述符对象
        const property = Object.getOwnPropertyDescriptor(obj, key)
        if (property && property.configurable === false) {
            return
        }
        // 提供预定义的存取器函数
        // cater for pre-defined getter/setters
        const getter = property && property.get
        const setter = property && property.set
        if ((!getter || setter) && arguments.length === 2) {
            val = obj[key]
        }
        // 判断是否递归观察子对象，并将子对象属性都转换成 getter/setter，返回子观察对象
        let childOb = !shallow && observe(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                // 如果预定义的 getter 存在则 value 等于 getter 调用的返回值
                // 否则直接赋予属性值
                const value = getter ? getter.call(obj) : val
                    // 如果存在当前依赖目标，即 watcher 对象，则建立依赖
                if (Dep.target) {
                    dep.depend()
                        // 如果子观察目标存在，建立子对象的依赖关系
                    if (childOb) {
                        childOb.dep.depend()
                            // 如果属性是数组，则特殊处理收集数组对象依赖
                        if (Array.isArray(value)) {
                            dependArray(value)
                        }
                    }
                }
                // 返回属性值
                return value
            },
            set: function reactiveSetter(newVal) {
                // 如果预定义的 getter 存在则 value 等于 getter 调用的返回值
                // 否则直接赋予属性值
                const value = getter ? getter.call(obj) : val
                    // 如果新值等于旧值或者新值旧值为 NaN 则不执行
                    /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if (process.env.NODE_ENV !== 'production' && customSetter) {
                    customSetter()
                }
                // 如果没有 setter 直接返回
                // #7981: for accessor properties without setter
                if (getter && !setter) return
                    // 如果预定义 setter 存在则调用，否则直接更新新值
                if (setter) {
                    setter.call(obj, newVal)
                } else {
                    val = newVal
                }
                // 如果新值是对象，观察子对象并返回子对象的 observer 对象
                childOb = !shallow && observe(newVal)
                    // 派发更新(发布更改通知)
                dep.notify()
            }
        })
    }
    ```
+ 数据响应式原理——依赖收集
  + 入口在 src/core/observer/index.js/defineReactive 函数里
  ```js
  // 创建依赖对象实例
  const dep = new Dep()
  if (Dep.target) {
    dep.depend()
        // 如果子观察目标存在，建立子对象的依赖关系
    if (childOb) {
        childOb.dep.depend()
            // 如果属性是数组，则特殊处理收集数组对象依赖
        if (Array.isArray(value)) {
            dependArray(value)
        }
    }
  }
  ```
  + class Dep(创建依赖对象实例)：文件在 src/core/observer/dep.js
  ```js
  export default class Dep {
      // 静态属性，watcher 对象
      static target: ? Watcher;
      // dep 实例 Id
      id: number;
      // dep 实例对应的 watcher 对象/订阅者数组
      subs: Array < Watcher > ;

      constructor() {
              this.id = uid++
                  this.subs = []
          }
          // 添加新的订阅者 watcher 对象
      addSub(sub: Watcher) {
              this.subs.push(sub)
          }
          // 移除订阅者
      removeSub(sub: Watcher) {
              remove(this.subs, sub)
          }
          // 将观察对象和 watcher 建立依赖
      depend() {
              if (Dep.target) {
                  // 如果 target 存在，把 dep 对象添加到 watcher 的依赖中
                  Dep.target.addDep(this)
              }
          }
          // 发布通知
      notify() {
          // stabilize the subscriber list first
          const subs = this.subs.slice()
          if (process.env.NODE_ENV !== 'production' && !config.async) {
              // subs aren't sorted in scheduler if not running async
              // we need to sort them now to make sure they fire in correct
              // order
              subs.sort((a, b) => a.id - b.id)
          }
          for (let i = 0, l = subs.length; i < l; i++) {
              subs[i].update()
          }
      }
  }
  ```
  + Dep.target 的 target 的添加逻辑在组件 mount 阶段时 mountComponent 函数里会添加 new Watcher() ,Watcher 类里的 constructor 里会调用 get 方法中的 pushTarget(this) 
    + class Watcher：src/core/observer/watcher.js
    ```js
    export default class Watcher {
      vm: Component;
      expression: string;
      cb: Function;
      id: number;
      deep: boolean;
      user: boolean;
      lazy: boolean;
      sync: boolean;
      dirty: boolean;
      active: boolean;
      deps: Array<Dep>;
      newDeps: Array<Dep>;
      depIds: SimpleSet;
      newDepIds: SimpleSet;
      before: ?Function;
      getter: Function;
      value: any;

      constructor (
        vm: Component,
        expOrFn: string | Function,
        cb: Function,
        options?: ?Object,
        isRenderWatcher?: boolean
      ) {
        this.vm = vm
        if (isRenderWatcher) {
          vm._watcher = this
        }
        vm._watchers.push(this)
        // options
        if (options) {
          this.deep = !!options.deep
          this.user = !!options.user
          this.lazy = !!options.lazy
          this.sync = !!options.sync
          this.before = options.before
        } else {
          this.deep = this.user = this.lazy = this.sync = false
        }
        this.cb = cb
        this.id = ++uid // uid for batching
        this.active = true
        this.dirty = this.lazy // for lazy watchers
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.expression = process.env.NODE_ENV !== 'production'
          ? expOrFn.toString()
          : ''
        // parse expression for getter
        if (typeof expOrFn === 'function') {
          this.getter = expOrFn
        } else {
          this.getter = parsePath(expOrFn)
          if (!this.getter) {
            this.getter = noop
            process.env.NODE_ENV !== 'production' && warn(
              `Failed watching path: "${expOrFn}" ` +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.',
              vm
            )
          }
        }
        this.value = this.lazy
          ? undefined
          : this.get()
      }

      /**
      * Evaluate the getter, and re-collect dependencies.
      */
      get () {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
          value = this.getter.call(vm, vm)
        } catch (e) {
          if (this.user) {
            handleError(e, vm, `getter for watcher "${this.expression}"`)
          } else {
            throw e
          }
        } finally {
          // "touch" every property so they are all tracked as
          // dependencies for deep watching
          if (this.deep) {
            traverse(value)
          }
          popTarget()
          this.cleanupDeps()
        }
        return value
      }

      /**
      * Add a dependency to this directive.
      */
      addDep (dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
          this.newDepIds.add(id)
          this.newDeps.push(dep)
          if (!this.depIds.has(id)) {
            dep.addSub(this)
          }
        }
      }

      /**
      * Clean up for dependency collection.
      */
      cleanupDeps () {
        let i = this.deps.length
        while (i--) {
          const dep = this.deps[i]
          if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
          }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
      }

      /**
      * Subscriber interface.
      * Will be called when a dependency changes.
      */
      update () {
        /* istanbul ignore else */
        if (this.lazy) {
          this.dirty = true
        } else if (this.sync) {
          this.run()
        } else {
          queueWatcher(this)
        }
      }

      /**
      * Scheduler job interface.
      * Will be called by the scheduler.
      */
      run () {
        if (this.active) {
          const value = this.get()
          if (
            value !== this.value ||
            // Deep watchers and watchers on Object/Arrays should fire even
            // when the value is the same, because the value may
            // have mutated.
            isObject(value) ||
            this.deep
          ) {
            // set new value
            const oldValue = this.value
            this.value = value
            if (this.user) {
              try {
                this.cb.call(this.vm, value, oldValue)
              } catch (e) {
                handleError(e, this.vm, `callback for watcher "${this.expression}"`)
              }
            } else {
              this.cb.call(this.vm, value, oldValue)
            }
          }
        }
      }

      /**
      * Evaluate the value of the watcher.
      * This only gets called for lazy watchers.
      */
      evaluate () {
        this.value = this.get()
        this.dirty = false
      }

      /**
      * Depend on all deps collected by this watcher.
      */
      depend () {
        let i = this.deps.length
        while (i--) {
          this.deps[i].depend()
        }
      }

      /**
      * Remove self from all dependencies' subscriber list.
      */
      teardown () {
        if (this.active) {
          // remove self from vm's watcher list
          // this is a somewhat expensive operation so we skip it
          // if the vm is being destroyed.
          if (!this.vm._isBeingDestroyed) {
            remove(this.vm._watchers, this)
          }
          let i = this.deps.length
          while (i--) {
            this.deps[i].removeSub(this)
          }
          this.active = false
        }
      }
    }
    ```
    + pushTarget(将 watcher 挂载到 Dep 的 target 属性下)：src/core/observer/dep.js
    ```js
    // Dep.target 用来存放目前正在使用的 watcher
    // 全局唯一，并且只能有一个 watcher 被使用
    Dep.target = null
    const targetStack = []
    // 入栈并将当前 watcher 赋值给 Dep.target
    export function pushTarget(target: ? Watcher) {
        targetStack.push(target)
        Dep.target = target
    }
    ```
    + dep.depend(收集依赖的过程)：src/core/observer/index.js/defineReactive 函数里
    + Dep 类里的 depend 方法源码如下：src/core/observer/dep.js
    ```js
            // 将观察对象和 watcher 建立依赖
        depend() {
            // Dep.target = watcher
            if (Dep.target) {
                // 如果 target 存在，把 dep 对象添加到 watcher 的依赖中
                Dep.target.addDep(this)
            }
        }
    ```
    + Watcher 类里的 addDep 方法源码如下：src/core/observer/watcher.js
    ```js
    addDep (dep: Dep) {
      const id = dep.id
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
          dep.addSub(this)
        }
      }
    }
    ```
    + Dep 类里的 addSub 方法源码如下：src/core/observer/dep.js
    ```js
    // 添加新的订阅者 watcher 对象
    addSub(sub: Watcher) {
      this.subs.push(sub)
    }
    ```
+ 依赖收集的流程图见 ./依赖收集流程.xmind

#### 9、数据响应式原理——数组

