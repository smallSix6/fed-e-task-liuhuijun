/**
 * 用户相关请求模块
 */
import qs from "qs";
import request from "@/utils/request";
// import store from '@/store'

interface User {
  phone: string;
  password: string;
}

export const login = (data: User) => {
  return request({
    method: "POST",
    url: "/front/user/login", // 此处要走代理，否则无法跨域请求
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果 data 是 qs.stringify(data) 格式，则 content-type 是 application/x-www-form-urlencoded
    // 如果 data 是 json 格式，则 content-type 是 application/json
    // 如果 data 是FormData 格式，则 content-type 是 multipart/form-data
    data: qs.stringify(data)
  });
};

export const getUserInfo = () => {
  return request({
    method: "GET",
    url: "/front/user/getInfo"
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  });
};

export const getUserPages = (data: User) => {
  return request({
    method: "POST",
    url: "/boss/user/getUserPages",
    data
  });
};
