/**
 * 资源相关请求模块
 */
import request from "@/utils/request";

interface Resource {
  name: string;
  url: string;
  description: string;
  categoryId: number;
  selected: boolean;
}

export const getResourcePages = (data: Resource) => {
  return request({
    method: "POST",
    url: "/boss/resource/getResourcePages",
    data
  });
};
