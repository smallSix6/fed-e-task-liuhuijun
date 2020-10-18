/**
 * 角色
 */
import request from "@/utils/request";

interface AllocateUserRoles {
  userId: number;
  roleIdList: Array<number>;
}

export const allocateUserRoles = (data: AllocateUserRoles) => {
  return request({
    method: "POST",
    url: "/boss/role/allocateUserRoles",
    data
  });
};

export const getAllRole = () => {
  return request({
    method: "GET",
    url: "/boss/role/all"
  });
};

export const getUserRole = (id: number) => {
  return request({
    method: "GET",
    url: `/boss/role/user/${id}`
  });
};

export const forbidUser = (userId: number) => {
  return request({
    method: "POST",
    url: "/boss/role/forbidUser",
    data: {
      userId
    }
  });
};
