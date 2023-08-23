import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { editBucketName, masterList } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';


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

  masterList().then((data) => {
    let array = data.data
    let list: DataSourceType[] = []
    if (array) {
      for (let index = 0; index < array?.length; index++) {
        const element = array[index];
        list.push({ id: index + 1, from: element.name, code: element.value })
      }
    }
    if (dataSource.length === 0)
      setDataSource(list)
  })

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
      render: (text: any, record: { id: string; name: string; key: any; from: string }, _: any, action: { startEditable: (arg0: any) => void; }) => [
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
            let result = await editBucketName(record.from, { key: "admin", value: "" })
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
              name: `${data.from}`,
              key: `admin`,
              value: `${data.code}`
            }
            // console.log(rowKey, data, row);
            let result = await editBucketName(`${data.from}`, body)
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