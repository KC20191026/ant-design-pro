import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { bucketNameList, editBucketName } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';
import { message } from 'antd';


type DataSourceType = {
  id: React.Key;
  from?: string;
  listen?: string;
  reply?: boolean;
  code?: any;
};

const Welcome: React.FC = () => {
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  let name = "autoReplyInfo"
  bucketNameList(name).then(data => {
    let array = data.data
    let list: DataSourceType[] = []
    if (array) {
      for (let index = 0; index < array?.length; index++) {
        const element = array[index];
        const value = element.value
        list.push({ id: element.key, code: value.groupId, from: value.from, listen: value.listen, reply: value.reply })
      }
    }
    if (dataSource.length === 0)
      setDataSource(list)
  })

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '平台',
      dataIndex: 'from',
    },
    {
      title: '号码',
      dataIndex: 'code',
      width: '15%',
    },
    {
      title: '触发词',
      dataIndex: 'listen',
    },
    {
      title: '自动回复内容',
      dataIndex: 'reply',
    },
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
            let result = await editBucketName([{ name, key: record.id, value: "" }])
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
    <PageContainer>
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
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            let body = [{
              name: name,
              key: `${data.id || crypto.randomUUID()}`,
              value: { "groupId": `${data.code}`, "from": `${data.from}`, "listen": `${data.listen}`, "reply": `${data.reply}` }
            }]
            // console.log(rowKey, data, row);
            let result = await editBucketName(body)
            if (result.data.status === 200) {
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

