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

