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

/** 获取搬运群组列表 GET /api/carry/groups */
export async function carryList(options?: {}) {
  return request<{ data: any; }>('/api/carry/groups', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改一条数据 POST /api/bucket/:name */
export async function editBucketName(body: {}, options?: {}) {
  return request<{
    status: number; data: any;
  }>('/api/bucket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改一条数据 POST /api/carry/group */
export async function editCarryGroup(body: {}, options?: {}) {
  return request<{
    status: number; data: any;
  }>('/api/carry/group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除一条数据 DELETE /api/carry/group */
export async function delCarryGroup(body: {}, options?: {}) {
  return request<{
    status: number; data: any;
  }>('/api/carry/group', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
