## Vue.js 源码分析（响应式、虚拟 DOM、模板编译和组件化）

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
    + vm.$mount 方法源码如下：
    ```js
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

