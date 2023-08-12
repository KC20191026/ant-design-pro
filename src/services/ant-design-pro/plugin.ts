// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取数据库列表 GET /api/bucket */
export async function pluginList(type:string, name: string, params: {}, options?: {}) {
  return request<{
    data: API.Result;
  }>('/api/plugin/' + type, {
    method: 'GET',
    params: {
      name: name,
      ... params 
    },
    ...(options || {}),
  });
}



