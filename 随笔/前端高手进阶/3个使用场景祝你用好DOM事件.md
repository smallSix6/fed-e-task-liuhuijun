## 防抖
```js
// 代码2
const debounce = (func, wait = 0) => {
  let timeout = null

  let args

  function debounced(...arg) {

    args = arg

    if(timeout) {

      clearTimeout(timeout)

      timeout = null

    }

    // 以Promise的形式返回函数执行结果

    return new Promise((res, rej) => {

      timeout = setTimeout(async () => {

        try {

          const result = await func.apply(this, args)

          res(result)

        } catch(e) {

          rej(e)

        }

      }, wait)

    })

  }

  // 允许取消

  function cancel() {

    clearTimeout(timeout)

    timeout = null

  }

  // 允许立即执行

  function flush() {

    cancel()

    return func.apply(this, args)

  }

  debounced.cancel = cancel

  debounced.flush = flush

  return debounced

}
```
## 节流
```js
const throttle = (func, wait = 0, execFirstCall) => {
  let timeout = null
  let args
  let firstCallTimestamp
  function throttled(...arg) {
    if (!firstCallTimestamp) firstCallTimestamp = new Date().getTime()
    if (!execFirstCall || !args) {
      console.log('set args:', arg)
      args = arg
    }
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    // 以Promise的形式返回函数执行结果
    return new Promise(async(res, rej) => {
      if (new Date().getTime() - firstCallTimestamp >= wait) {
        try {
          const result = await func.apply(this, args)
          res(result)
        } catch (e) {
          rej(e)
        } finally {
          cancel()
        }
      } else {
        timeout = setTimeout(async () => {
          try {
            const result = await func.apply(this, args)
            res(result)
          } catch (e) {
            rej(e)
          } finally {
            cancel()
          }
        }, firstCallTimestamp + wait - new Date().getTime())
      }
    })
  }
  // 允许取消
  function cancel() {
    clearTimeout(timeout)
    args = null
    timeout = null
    firstCallTimestamp = null
  }
  // 允许立即执行
  function flush() {
    cancel()
    return func.apply(this, args)
  }
  throttled.cancel = cancel
  throttled.flush = flush
  return throttled
}
```
## 事件代理
```js
const ul = document.querySelector('.list')
ul.addEventListener('click', e => {
  const t = e.target || e.srcElement
  if (t.classList.contains('item')) {
    getInfo(t.id)
  } else {
    id = t.parentElement.id
    if (t.classList.contains('edit')) {
      edit(id)
    } else if (t.classList.contains('delete')) {
      del(id)
    }
  }
})
```
## 箭头函数
+ 箭头函数和普通函数相比，有以下几个区别，在开发中应特别注意：
  + 不绑定 arguments 对象，也就是说在箭头函数内访问 arguments 对象会报错；
  + 不能用作构造器，也就是说不能通过关键字 new 来创建实例；
  + 默认不会创建 prototype 原型属性；
  + 不能用作 Generator() 函数，不能使用 yeild 关键字。





