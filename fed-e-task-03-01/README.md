diff算法的核心21节


一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
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
      原因：vm[key] set 操作的时候会触发 data[key] 的 set 操作，data[key] 的 set 操作会 walk 这个新的值（walk方法是给data里的对象类型的值设置响应式），而题目中的 data 的 dog 是个空对象，没有任何属性，所以初始化 Vue 实例的时候，在给 dog 设置 proxy 的时候没有任何属性有 getter 和 setter 方法，所以在点击按钮动态的给 dog 添加 name 属性，并设置值的时候是不会触发 dog 对象下的属性 name 的 setter 方法，故不是响应式数据。而给 dog 对象添加了 name 的初始值后，dog 对象的 name 属性就有了 getter 和 setter 方法，故可以实现响应式。
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



2、请简述 Diff 算法的执行过程
 

二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令
 

3、参考 Snabbdom 提供的电影列表的示例，实现类似的效果，如图：
 + ![avatar](./images/snabbdom.png)

