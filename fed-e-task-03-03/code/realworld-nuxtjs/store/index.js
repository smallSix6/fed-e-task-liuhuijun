const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行都是同一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  }
}
export const actions = {
  // nuxtServerInit 是一个特殊的 action 方法
  // 这个 action 会在服务端渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      // 将请求头中的 Cookie 字符串解析为一个对象 
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        // 将 user 还原为 JavaScript 对象 
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found 
      }
    }
    commit('setUser', user)
  }
}


