const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败

class MyPromise {
    constructor(executor) {
            try {
                executor(this.resolve, this.reject)
            } catch (e) {
                this.reject(e)
            }

        }
        // promise 状态
    status = PENDING
        // 成功之后的值
    value = undefined
        // 失败后的原因
    reason = undefined
        // 成功之后的回调函数
    successCallbacks = []
        // 失败之后的回调函数
    failCallbacks = []
    catch (failCallback) {
        return this.then(undefined, failCallback)
    }
    resolve = value => {
        // 如果状态不是等待  阻止程序向下执行
        if (this.status !== PENDING) { return }

        // 将状态更改为成功
        this.status = FULFILLED
        this.value = value
        while (this.successCallbacks.length) {
            this.successCallbacks.shift()()
        }
    }
    reject = reason => {
        // 如果状态不是等待  阻止程序向下执行
        if (this.status !== PENDING) { return }

        // 将状态更改为成功
        this.status = REJECTED
        this.reason = reason
        while (this.failCallbacks.length) {
            this.failCallbacks.shift()()
        }
    }
    then = (successCallback, failCallback) => {
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        let promise2 = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value)
                            // 判断 x 的值是普通值还是 promise 对象
                            // 如果是普通值，直接调用 resolve
                            // 如果是 promise 对象，查看 promise 对象返回的结果
                            // 再根据 promise 对象返回的结果，决定调用 resolve 还是调用 reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                            // 判断 x 的值是普通值还是 promise 对象
                            // 如果是普通值，直接调用 resolve
                            // 如果是 promise 对象，查看 promise 对象返回的结果
                            // 再根据 promise 对象返回的结果，决定调用 resolve 还是调用 reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            } else {
                this.successCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                                // 判断 x 的值是普通值还是 promise 对象
                                // 如果是普通值，直接调用 resolve
                                // 如果是 promise 对象，查看 promise 对象返回的结果
                                // 再根据 promise 对象返回的结果，决定调用 resolve 还是调用 reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
                this.failCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                                // 判断 x 的值是普通值还是 promise 对象
                                // 如果是普通值，直接调用 resolve
                                // 如果是 promise 对象，查看 promise 对象返回的结果
                                // 再根据 promise 对象返回的结果，决定调用 resolve 还是调用 reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
            }
        })

        return promise2
    }
    finally(callback) {
        return this.then(
            value => {
                return MyPromise.resolve(callback()).then(() => value)
            },
            reason => {
                return MyPromise.resolve(callback()).then(() => { throw reason })
            }
        )
    }
    static all(array) {
        let result = []
        let index = 0;


        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value
                index++;
                if (index === array.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    // promise 对象
                    current.then(value => {
                        addData(i, value)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    // 普通值
                    addData(i, array[i])
                }
            }
        })
    }
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value
        } else {
            return new MyPromise(resolve => {
                resolve(value)
            })
        }
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<promise>'))
    }
    if (x instanceof MyPromise) {
        // promise 对象
        x.then(resolve, reject)
    } else {
        // 普通值
        resolve(x)
    }
}
module.exports = MyPromise





// 实现 promise 最大请求数
class limitPromise {
  constructor(max) {
    this.max = max
    this._count = 0
    this._pendingTask = []
  }
  call = (caller, ...arg) => {
    return new Promise((resolve, reject) => {
      let task = this._createTask(caller, arg, resolve, reject)
      if(this.max > this._count) {
        this._pendingTask.push()
      }else{
        task()
      }     
    })
  }
  _createTask = (caller, arg, resolve, reject) => {
    return () => {
      this._count++;
      caller(...arg).then(resolve).catch(reject).finally(()=>{
        this._count--;
        if (this._pendingTask.length) {
          let task = this._pendingTask.shift()
          task()
        }
      })
    }
  }
}