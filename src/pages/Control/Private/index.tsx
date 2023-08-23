import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { bucketNameList, editBucketName } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';


type DataSourceType = {
  id: React.Key;
  name: string;
  from?: string;
  // decs?: string;
  enable?: boolean;
};

const Welcome: React.FC = () => {
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  let name = "userBlacklist"
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
    if (dataSource.length === 0)
      setDataSource(list)
  })

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '账号',
      dataIndex: 'id',
      width: '15%',
    },
    // {
    //   title: '昵称',
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
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text: any, record: { id: string; name: string; key: any; }, _: any, action: { startEditable: (arg0: any) => void; }) => [
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
            let result = await editBucketName(record.name, { key: record.key, value: "" })
            if (result.data.status === 200) {
              console.log("删除数据", record)
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
            let body = {
              name: `${data.name}`,
              key: `${data.from}:${data.id}`,
              value: `${data.enable}`
            }
            // console.log(rowKey, data, row);
            let result = await editBucketName(name, body)
            if (result.data.status === 200) {
              console.log("添加成功")
            }
          },
          onChange: setEditableRowKeys

        }}
      />
    </PageContainer>
  )
}

export default Welcome;

