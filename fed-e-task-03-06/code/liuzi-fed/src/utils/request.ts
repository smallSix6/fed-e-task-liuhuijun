import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import qs from "qs";

function redirectLogin () {
  return router.push({
    name: "login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}

function refreshToken () {
  return axios.create()({ // 创建一个新的 axios 实例发送请求，因为如果使用request会可能发生 401 死循环
    method: "POST",
    url: "/front/user/refresh_token",
    data: qs.stringify({
      // refreshtoken 只能使用一次
      refreshtoken: store.state.user.refresh_token
    })
  });
}

const request = axios.create({
  // 配置选项
  // baseURL,
  // timeout,
});

// 请求拦截器 request
request.interceptors.request.use(function (config) {
  // 这里是拦截的接口
  // 改写 config 对象
  const { user } = store.state;
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应拦截器 request
let isRefreshing = false; // 控制刷新 token 的状态
let requests: (() => void)[] = []; // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(function (response) { // 状态码为 2xx 都会进入这里
  return response;
}, async function (error) { // 超过 2xx 状态码都在这里
  console.dir("请求响应失败了", error);
  // 如果使用的 HTTP 状态码，错误处理就写到这里
  if (error.response) { // 请求收到响应了，但是状态码超过了 2xx 范围
    // 400
    // 401
    // 403
    // 404
    // 500
    const { status } = error.response;
    if (status === 400) {
      Message.error("请求参数错误");
    } else if (status === 401) {
      // token 无效 （没有提供 token, token 是无效的, token 过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user) {
        redirectLogin();
        return Promise.reject(error);
      }
      if (!isRefreshing) { // 解决多次请求重新刷新 Token 的问题
        isRefreshing = true;
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error("刷新 Token 失败");
          }
          // 成功了 -> 把本次失败的请求重新发出去
          // 把成功刷新拿到的 access_token 更新到容器和本地存储中
          store.commit("setUser", res.data.content);
          // 把本地失败的请求重新发出去
          requests.forEach(cb => cb());
          requests = []; // 重置 requests 数组
          return request(error.config); // 失败请求的配置信息
        }).catch(err => {
          // 把当前登录用户状态清除
          store.commit("setUser", null);
          // 失败了 -> 直接去跳转到登录页
          redirectLogin();
          return Promise.reject(err);
        }).finally(() => {
          isRefreshing = false; // 重置状态
        });
      }
      // 刷新状态下，把请求挂起，放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config));
        });
      });
    } else if (status === 403) {
      Message.error("没有权限，请联系管理员");
    } else if (status === 404) {
      Message.error("请求资源不存在");
    } else if (status >= 500) {
      Message.error("服务端错误，请联系管理员");
    }
  } else if (error.request) { // 请求发出去了，但是没有收到响应（请求超时，网络断开）
    Message.error("请求超时，请刷新重试");
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error("请求失败: " + error.message);
  }
  // 把请求失败的错误对象继续抛出，扔给下一个调用者
  return Promise.reject(error);
});

export default request;
