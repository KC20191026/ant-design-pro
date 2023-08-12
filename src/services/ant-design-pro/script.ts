// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取插件详情 GET /api/script */
export async function getPlugin(id:string, options?: {}) {
  return request<{
    data: API.Result;
  }>('/api/script/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}
/** 删除插件 DELETE /api/script */
export async function deletePlugin(id:string, options?: {}) {
  return request<{
    data: API.Result;
  }>('/api/script/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 修改一条数据 POST /api/script/:id */
export async function editPlugin(id: string, data :string, options?: {}) {
  return request<{
    data: API.Result;
  }>('/api/script/' + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      data: data
    },
    ...(options || {}),
  });
}


