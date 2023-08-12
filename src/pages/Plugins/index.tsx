import { ProList } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { request } from '@umijs/max';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { pluginList } from '@/services/ant-design-pro/plugin';
import { history } from 'umi';
import {  deletePlugin } from '@/services/ant-design-pro/script';

type Item = {

  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  description: string;

};


const app: React.FC = () => {
  const location = useLocation();
  let type = location.pathname.replace("/plugins/", "")
  console.log("参数", type)

  return (
    <ProList<Item>
      toolBarRender={() => {
        return [
          // <Button key="3" type="primary">
          //   新建
          // </Button>,
        ];
      }}
      search={{}}
      rowKey="name"
      headerTitle="基础列表"
      request={async (params = {}) => {
        console.log("参数", params)
        let name = ""
        if (params.title) {
          name = params.title
        }

        let result = await pluginList(type, name, {
          page: params.current,
          pageSize: params.pageSize,
        })
        console.log(result)

        return {
          data: result.data,
          // success 请返回 true，
          // 不然 table 会停止解析数据，即使有数据
          success: true,
          // 不传会使用 data 的长度，如果是分页一定要传
          total: result.total,
        };

        // return request<{
        //   data: GithubIssueItem[];
        // }>('https://proapi.azurewebsites.net/github/issues', {
        //   params,
        // })
      }

      }
      pagination={{
        pageSize: 10,
      }}
      showActions="hover"
      metas={{
        title: {
          dataIndex: 'title',
          title: '用户',
        },
        avatar: {
          dataIndex: 'icon',
          search: false,
        },
        description: {
          dataIndex: 'description',
          search: false,
        },
        subTitle: {
          dataIndex: 'labels',
          render: (_, row) => {
            return (
              <Space size={0}>
                {row.labels?.map((label: { name: string }) => (
                  <Tag color="blue" key={label.name}>
                    {label.name}
                  </Tag>
                ))}
              </Space>
            );
          },
          search: false,
        },
        actions: {
          render: (text, record, _, action) => [
            // <a href={row.url} target="_blank" rel="noopener noreferrer" key="link">
            //   链路
            // </a>,
            // <a href={row.url} target="_blank" rel="noopener noreferrer" key="warning">
            //   报警
            // </a>,
            // <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
            //   查看
            // </a>,
            <a
            key="view"
            onClick={async () => {
              history.push(`/scripts/${record.uniqueKey}`);
            }}
          >
            查看
          </a>,
            <a
              key="delete"
              target="_blank"
              onClick={async () => {
                // console.log("删除数据", record)
                deletePlugin(record.uniqueKey).finally(function() {
                  // 返回状态为 (resolved 或 rejected)
                  action?.reload()
               })
              }}
            >
              删除
            </a>,
          ],
          search: false,
        },

      }}
    />
  )
}
export default app