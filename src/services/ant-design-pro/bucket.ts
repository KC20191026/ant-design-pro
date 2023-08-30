// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取数据库列表 GET /api/bucket */
export async function bucketList(options?: {}) {
  return request<{ data: any; }>('/api/bucket', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取name数据库列表 GET /api/bucket/:name */
export async function bucketNameList(name: string, options?: {}) {
  return request<{ data: any; }>('/api/bucket/' + name, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取管理员列表 GET /api/bucket */
export async function masterList(options?: {}) {
  return request<{ data: any; }>('/api/master/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改一条数据 POST /api/bucket/:name */
export async function editBucketName(name: string, body: {}, options?: {}) {
  return request<{
    status: number; data: any; 
}>('/api/bucket/' + name, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


