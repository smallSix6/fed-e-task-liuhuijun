import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem("user") || "null") // 当前登录用户状态
  },
  mutations: {
    // 修改容器数据，必须使用mutation函数
    setUser (state, payload) {
      state.user = JSON.parse(payload);
      window.localStorage.setItem("user", payload);
    }
  },
  actions: {
  },
  modules: {
  }
});
