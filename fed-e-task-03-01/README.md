diff算法的核心21节

# 刘惠俊 Part3 模块一 手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法 作业

## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据(代码如下)，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
+ 答：不是响应式数据。响应式对象和响应式数组是指在vue初始化时期，利用Object.defineProperty()方法对其进行监听，这样在修改数据时会及时体现在页面上。
  + 设置为响应式数据有两种方法：
    + 1、给 dog 的属性 name 设置一个初始值，可以为空字符串或者 undefined 之类的，代码和原因如下：


      ```js
      let vm = new Vue({
          el: '#app',
          data: {
              msg: 'object',
              dog: {
                  name: ''
              }
          },
          method: {
              clickHandler() {
                  // 该 name 属性是否是响应式的
                  this.dog.name = 'Trump'
              }
          }
      })
      ```



      + 原因：vm[key] setter 操作的时候会触发 data[key] 的 setter 操作，data[key] 的 setter 操作会 walk 这个新的值（walk方法是给data里的对象类型的值设置响应式），而题目中的 data 的 dog 是个空对象，没有任何属性，所以初始化 Vue 实例的时候，在给 dog 设置 proxy 的时候没有任何属性有 getter 和 setter 方法，所以在点击按钮动态的给 dog 添加 name 属性，并设置值的时候是不会触发 dog 对象下的属性 name 的 setter 方法，故不是响应式数据。而给 dog 对象添加了 name 的初始值后，dog 对象的 name 属性就有了 getter 和 setter 方法，故可以实现响应式。代码如下：
        + vue.js(监听 vm[key]的 getter 和 setter 操作 )
        ```js
          class Vue {
            constructor(options) {
                // 1、通过属性保存选项的数据
                this.$options = options || {}
                this.$data = options.data || {}
                this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
                    // 2、把 data 中的成员转换成 getter 和 setter,并注入到 vue 实例中
                this._proxyData(this.$data)
                    // 3、调用 observer 对象，监听数据的变化
                new Observer(this.$data)
                    // 4、调用 compiler 对象，解析指令和插值表达式
                new Compiler(this)
            }
            _proxyData(data) {
                // 遍历 data 中的所有属性
                Object.keys(data).forEach(key => {
                    // 把 data 的属性注入到 vue 实例中
                    Object.defineProperty(this, key, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            return data[key]
                        },
                        set(newValue) {
                            if (newValue !== data[key]) {
                                data[key] = newValue
                            }
                        }
                    })
                })
            }
        }
        ```
        + observe.js (data[key] 的 setter 操作会 walk 这个新的值,walk方法是给data里的对象类型的值设置响应式)
          ```js
          class Observer {
              constructor(data) {
                  this.walk(data)
              }
              walk(data) {
                  // 1、判断 data 是否是对象
                  if (!data || typeof data !== 'object') {
                      return
                  }
                  // 2、遍历 data 对象的所有属性
                  Object.keys(data).forEach(key => {
                      this.defineReactive(data, key, data[key])
                  })
              }
              defineReactive(obj, key, val) {
                  let that = this
                      // 负责收集依赖，并发送通知
                  let dep = new Dep()
                      // 如果 val 是对象，把 val 内部的属性转换成响应式数据
                  that.walk(val)

                  Object.defineProperty(obj, key, {
                      enumerable: true,
                      configurable: true,
                      get() {
                          // 收集依赖
                          Dep.target && dep.addSub(Dep.target)
                          return val
                      },
                      set(newValue) {
                          console.log(newValue, '>>>>>', val)
                          if (newValue === val) {
                              return
                          }
                          val = newValue
                          that.walk(newValue)
                              // 发送通知
                          dep.notify()
                      }
                  })
              }
          }
          ```
    + 2、使用 Vue.set(target, key, value) 时，target 为需要添加属性的对象，key 是要添加的属性名，value 为属性 key 对应的值, vue 中 set 的源码如下：


      ```js
      export function set (target: Array<any> | Object, key: any, val: any): any {
        if (process.env.NODE_ENV !== 'production' &&
          (isUndef(target) || isPrimitive(target))
        ) {
          warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
        }
        if (Array.isArray(target) && isValidArrayIndex(key)) {
          target.length = Math.max(target.length, key)
          target.splice(key, 1, val)
          return val
        }
        if (key in target && !(key in Object.prototype)) {
          target[key] = val
          return val
        }
        const ob = (target: any).__ob__
        if (target._isVue || (ob && ob.vmCount)) {
          process.env.NODE_ENV !== 'production' && warn(
            'Avoid adding reactive properties to a Vue instance or its root $data ' +
            'at runtime - declare it upfront in the data option.'
          )
          return val
        }
        if (!ob) {
          target[key] = val
          return val
        }
        defineReactive(ob.value, key, val)
        ob.dep.notify()
        return val
      }
      ```


    + 上面源码的执行逻辑如下(参考链接：<https://www.cnblogs.com/heavenYJJ/p/9559439.html>)：
      + 1、如果是在开发环境，且 target 未定义（为 null、undefined ）或 target 为基础数据类型（string、boolean、number、symbol）时，抛出告警；
      + 2、如果 target 为数组且 key 为有效的数组 key 时，将数组的长度设置为 target.length 和 key 中的最大的那一个，然后调用数组的  splice 方法（ vue 中重写的 splice 方法）添加元素；
      + 3、如果属性 key 存在于 target 对象中且 key 不是 Object.prototype 上的属性时，表明这是在修改 target 对象属性 key 的值（不管 target 对象是否是响应式的，只要 key 存在于 target 对象中，就执行这一步逻辑），此时就直接将 value 直接赋值给 target[key]；
      + 4、判断 target，当 target 为 vue 实例或根数据 data 对象时，在开发环境下抛错；
      + 5、当一个数据为响应式时，vue 会给该数据添加一个 __ob__ 属性，因此可以通过判断target对象是否存在 __ob__ 属性来判断 target 是否是响应式数据，当 target 是非响应式数据时，我们就按照普通对象添加属性的方式来处理；当 target 对象是响应式数据时，我们将 target 的属性 key 也设置为响应式并手动触发通知其属性值的更新；
    + defineReactive(ob.value, key, val) ,将新增属性设置为响应式; ob.dep.notify() 手动触发通知该属性值的更新, 所以我们可以修改代码如下：


      ```js
      let vm = new Vue({
              el: '#app',
              data: {
                  msg: 'object',
                  dog: {
                      name: undefined
                  }
              },
              method: {
                  clickHandler() {
                      // 该 name 属性是否是响应式的
                      this.$set(this.data.dog, name, 'Trump')
                  }
              }
          })
      ```



### 2、请简述 Diff 算法的执行过程
+ 答：
  + diff 的过程就是调用名为 patch 的函数，比较新旧节点，一边比较一边给真实的 DOM 打补丁。
  + patch 函数接收两个参数 oldVnode 和 Vnode 分别代表新的节点和之前的旧节点,这个函数会比较 oldVnode 和 vnode 是否是相同的, 即函数 sameVnode(oldVnode, vnode), 根据这个函数的返回结果分如下两种情况：
    + true：则执行 patchVnode
    + false：则用 vnode 替换 oldVnode
  + patchVnode 这个函数做了以下事情：
    + 找到对应的真实 dom，称为 el
    + 判断 vnode 和 oldVnode 是否指向同一个对象，如果是，那么直接 return
    + 如果他们都有文本节点并且不相等，那么将 el 的文本节点设置为 vnode 的文本节点。
    + 如果 oldVnode 有子节点而 vnode 没有，则删除 el 的子节点
    + 如果 oldVnode 没有子节点而 vnode 有，则将 vnode 的子节点真实化之后添加到 el
    + 如果两者都有子节点，则执行 updateChildren 函数比较子节点，这一步很重要
  + 其他几个点都很好理解，我们详细来讲一下updateChildren，代码如下：
    ```js
    updateChildren (parentElm, oldCh, newCh) {
        let oldStartIdx = 0, newStartIdx = 0
        let oldEndIdx = oldCh.length - 1
        let oldStartVnode = oldCh[0]
        let oldEndVnode = oldCh[oldEndIdx]
        let newEndIdx = newCh.length - 1
        let newStartVnode = newCh[0]
        let newEndVnode = newCh[newEndIdx]
        let oldKeyToIdx
        let idxInOld
        let elmToMove
        let before
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {   // 对于vnode.key的比较，会把oldVnode = null
                oldStartVnode = oldCh[++oldStartIdx] 
            }else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx]
            }else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx]
            }else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            }else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode)
                api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
                oldStartVnode = oldCh[++oldStartIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode)
                api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
                oldEndVnode = oldCh[--oldEndIdx]
                newStartVnode = newCh[++newStartIdx]
            }else {
              // 使用key时的比较
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
                }
                idxInOld = oldKeyToIdx[newStartVnode.key]
                if (!idxInOld) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                    newStartVnode = newCh[++newStartIdx]
                }
                else {
                    elmToMove = oldCh[idxInOld]
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                    }else {
                        patchVnode(elmToMove, newStartVnode)
                        oldCh[idxInOld] = null
                        api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                    }
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
        }else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
        }
    }
    ```
    + 首先介绍下这个函数中的变量定义：
      + （oldStartIdx = 0）：oldVnode 的 startIdx, 初始值为 0
      + （newStartIdx = 0）：vnode 的 startIdx, 初始值为 0
      + （oldEndIdx = oldCh.length - 1）：oldVnode 的 endIdx, 初始值为 oldCh.length - 1
      + （oldStartVnode = oldCh[0]）：oldVnode 的初始开始节点
      + （oldEndVnode = oldCh[oldEndIdx]）：oldVnode 的初始结束节点
      + （newEndIdx = newCh.length - 1）：vnode 的 endIdx, 初始值为 newCh.length - 1
      + （newStartVnode = newCh[0]）：vnode 的初始开始节点
      + （newEndVnode = newCh[newEndIdx]）：vnode 的初始结束节点
    + 当 oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 时，执行如下循环判断：
      + 1、oldStartVnode 为 null，则 oldStartVnode 等于 oldCh 的下一个子节点，即 oldStartVnode 的下一个兄弟节点
      + 2、oldEndVnode 为 null, 则 oldEndVnode 等于 oldCh 的相对于 oldEndVnode 上一个子节点，即 oldEndVnode 的上一个兄弟节点
      + 3、newStartVnode 为 null，则 newStartVnode 等于 newCh 的下一个子节点，即 newStartVnode 的下一个兄弟节点
      + 4、newEndVnode 为 null, 则 newEndVnode 等于 newCh 的相对于 newEndVnode 上一个子节点，即 newEndVnode 的上一个兄弟节点
      + 5、oldEndVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldStartVnode, newStartVnode)，执行完后 oldStartVnode 为此节点的下一个兄弟节点，newStartVnode 为此节点的下一个兄弟节点
      + 6、oldEndVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldEndVnode, newEndVnode)，执行完后 oldEndVnode 为此节点的上一个兄弟节点，newEndVnode 为此节点的上一个兄弟节点
      + 7、oldStartVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldStartVnode, newEndVnode)，执行完后 oldStartVnode 为此节点的下一个兄弟节点，newEndVnode 为此节点的上一个兄弟节点
      + 8、oldEndVnode 和 newStartVnode 为相同节点则执行 patchVnode(oldEndVnode, newStartVnode)，执行完后 oldEndVnode 为此节点的上一个兄弟节点，newStartVnode 为此节点的下一个兄弟节点
      + 9、使用 key 时的比较：
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
    + 当上述 9 个判断执行完后，oldStartIdx 大于 oldEndIdx，则将 vnode 中多余的节点根据 newStartIdx 插入到 dom 中去；newStartIdx 大于 newEndIdx，则将 dom 中在区间 【oldStartIdx， oldEndIdx】的元素节点删除


## 二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
+ 答：自己实现的 vue-router 的代码如下(完整代码见)：
  ```js
  let _Vue = null
  export default class VueRouter {
      static install(Vue) {
          // 1、判断当前插件是否已经安装
          if (VueRouter.install.installed) {
              return
          }
          VueRouter.install.installed = true
              // 2、把 vue 构造函数记录到全局变量
          _Vue = Vue
              // 3、把创建 vue 实例时候传入的 router 对象注入到 vue 实例上
              // 混入
          _Vue.mixin({
              beforeCreate() {
                  if (this.$options.router) {
                      _Vue.prototype.$router = this.$options.router
                      this.$options.router.init()
                  }
              }
          })
      }
      constructor(options) {
          this.options = options
          this.routeMap = {}
          this.data = _Vue.observable({
              current: '/'
          })
      }
      init() {
          this.createRouteMap()
          this.initComponents(_Vue)
          this.initEvent()
      }
      createRouteMap() {
          // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
          this.options.routes.forEach(route => {
              this.routeMap[route.path] = route.component
          })
      }
      initComponents(Vue) {
          const self = this
          Vue.component(
              'router-link', {
                  props: {
                      to: String
                  },
                  render(h) {
                      return h('a', {
                          attrs: {
                              href: '#' + this.to
                          },
                          on: {
                              click: this.clickHandler
                          }
                      }, [this.$slots.default])
                  },
                  methods: {
                      clickHandler(e) {
                          window.location.hash = '#' + this.to
                          this.$router.data.current = this.to
                          e.preventDefault()
                      }
                  }
                  // template: '<a :href="to"><slot></slot></a>'
              }
          )

          Vue.component('router-view', {
              render(h) {
                  const conmponent = self.routeMap[self.data.current]
                  return h(conmponent)
              }
          })
      }

      initEvent() {
          window.addEventListener('load', this.hashChange.bind(this))
          window.addEventListener('hashchange', this.hashChange.bind(this))
      }
      hashChange() {
          if (!window.location.hash) {
              window.location.hash = '#/'
          }
          this.data.current = window.location.hash.substr(1)

      }
  }
  ```
 

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令
 

3、参考 Snabbdom 提供的电影列表的示例，实现类似的效果，如图：
 + ![avatar](./images/snabbdom.png)










