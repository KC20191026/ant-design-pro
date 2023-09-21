import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { bucketNameList, editBucketName } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';
import { Alert, Switch, message } from 'antd';


type DataSourceType = {
  id: React.Key;
  name: string;
  from?: string;
  // decs?: string;
  enable?: any;
};

const Welcome: React.FC = () => {
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');
  const name = "groupWhitelist"

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '群号',
      dataIndex: 'id',
      width: '15%',
    },
    // {
    //   title: '群称',
    //   width: '15%',
    //   editable: false,
    //   dataIndex: 'name',
    // },
    {
      title: '平台',
      // editable: false,
      dataIndex: 'from',
    },
    // {
    //   title: '备注',
    //   dataIndex: 'decs',
    // },
    {
      title: '状态',
      dataIndex: 'enable',
      // readonly: true,
      // disable: true,
      valueType: 'switch',
      render: (text, record) => (
        <Switch checkedChildren='' unCheckedChildren='' checked={record.enable == 'true' ? true : false} />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _: any, action: any) => [
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
            let result = await editBucketName([{ name: record.name, key: `${record.from}:${record.id}`, value: "" }])
            if (result.status === 200) {
              console.log("删除数据", record)
              message.success('删除成功!', 1)
            }
          }}
        >
          删除
        </a >,
      ],
    },
  ];

  return (
    <PageContainer>
      <Alert message="安全起见，群聊消息默认不会被监听处理，你可以在这里添加你想要接收处理消息的群聊，也可以直接在群聊中使用listen和unlisten开启和关闭。" type="info" />
      <br />
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
          bucketNameList(name).then(data => {
            let array = data.data
            let list: DataSourceType[] = []
            if (array) {
              for (let index = 0; index < array?.length; index++) {
                const element = array[index];
                const from = element.key.split(':')[0]
                const id = element.key.split(':')[1]
                list.push({ id: id, from: from, name: name, enable: element.value })
              }
            }
            setDataSource(list)
          })
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            let body = [{
              name: `${data.name}`,
              key: `${data.from}:${data.id}`,
              value: `${data.enable}`
            }]
            // console.log(rowKey, data, row);
            let result = await editBucketName(body)
            if (result.status === 200) {
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

