import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { bucketList, bucketNameList, editBucketName } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';
import { Select } from 'antd';


type DataSourceType = {
  id: React.Key;
  num: number;
  name: string;
  key?: string;
  value?: any;

};


function onSelect(option: any, setName: { (value: React.SetStateAction<string>): void; (arg0: any): void; }, setDataSource: { (value: React.SetStateAction<readonly DataSourceType[]>): void; (arg0: DataSourceType[]): void; }) {
  // console.log(option)
  let name = option.label.replace("[桶]", "")
  //获取列表
  setName(name)
  setDataSource([])
  bucketNameList(name).then(data => {
    // console.log(data)
    let array = data.data
    let list: DataSourceType[] = []
    if (array) {
      for (let index = 0; index < array?.length; index++) {
        const element = array[index];
        // console.log(element)
        list.push({ id: (Math.random() * 1000000).toFixed(0), num: index + 1, name: name, key: element.key, value: element.value })
      }
    }
    setDataSource(list)
  })

}

const Welcome: React.FC = () => {

  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  bucketList().then((data) => {
    let array = data.data
    let list = []
    for (let index = 0; index < array?.length; index++) {
      const element = array[index]
      list.push({ value: index, name: element, label: `[桶]${element}` })
    }
    if (options.length === 0) {
      setOptions(list)
    }

  })

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      dataIndex: 'num',
      width: '5%',
      editable: false,
    },
    {
      title: '存储桶',
      dataIndex: 'name',
      formItemProps: (form: any, { rowIndex }: any) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      // 第一行不允许编辑
      editable: false,
      width: '10%',
    },
    {
      title: '键名',
      width: '30%',
      dataIndex: 'key',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text: any, record: { id: React.Key; name: string; key: any; }, _: any, action: { startEditable: (arg0: any) => void; }) => [
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
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="选择数据存储"
        optionFilterProp="children"
        filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        onSelect={
          (value, option) => {
            onSelect(option, setName, setDataSource)
          }

        }
        options={options}
      />
      <br />
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
            // console.log(rowKey, data, row);
            let result = await editBucketName(name, data)
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

