import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { editBucketName, masterList } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';
import { message } from 'antd';


type DataSourceType = {
  id: React.Key;
  from?: string;
  // decs?: string;
  code?: any;
};

const Welcome: React.FC = () => {
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: '15%',
      editable: false,
    },
    {
      title: '平台',
      dataIndex: 'from',
    },
    {
      title: '号码',
      dataIndex: 'code',
    },
    // {
    //   title: '昵称',
    //   dataIndex: 'decs',
    // },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text: any, record: any, _: any, action: any) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
            let result = await editBucketName([{ name: record.name, key: "admin", value: "" }])
            if (result.status === 200) {
              console.log("删除数据", record)
              message.success('删除成功!', 1)
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        children: '管理员列表',
      }}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle=""
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== 'hidden'
            ? {
              position: position as 'top',
              record: () => ({ id: (Math.random() * 1000000).toFixed(0), name: name }),
            }
            : false
        }
        loading={false}

        columns={columns}
        request={(params, sorter, filter) => {
          return new Promise(_any => masterList().then((data) => {
            let array = data.data;
            let list: DataSourceType[] = [];
            if (array) {
              for (let index = 0; index < array?.length; index++) {
                const element = array[index];
                list.push({ id: index + 1, from: element.name, code: element.value });
              }
            }
            setDataSource(list);
          }))
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            let body = [{
              name: `${data.from}`,
              key: `admin`,
              value: `${data.code}`
            }]
            // console.log(rowKey, data, row);
            let result = await editBucketName(body)
            if (result.status === 200) {
              console.log("保存成功")
              message.success('保存成功!', 1)
            }
          },
          onChange: setEditableRowKeys

        }}
      />
    </PageContainer>
  )
}

export default Welcome;