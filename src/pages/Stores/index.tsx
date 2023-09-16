import { EditableProTable, PageContainer, ProColumns } from '@ant-design/pro-components';
import { bucketList, bucketNameList, editBucketName } from '@/services/ant-design-pro/bucket';
import React, { useState } from 'react';
import { Select, Modal, message, Button } from 'antd';


type DataSourceType = {
  id: React.Key;
  num: number;
  name: string;
  key?: string;
  value?: any;
  type: string;
};

function onSelect(name: any, setName: any, setDataSource: any) {
  // console.log(name)
  //获取列表
  setName(name)
  bucketNameList(name).then(data => {
    // console.log(data)
    let array = data.data
    let list: DataSourceType[] = []
    if (array) {
      for (let index = 0; index < array?.length; index++) {
        const element = array[index];
        // console.log(element)
        list.push({ id: (Math.random() * 1000000).toFixed(0), num: index + 1, name: name, key: element.key, value: typeof element.value == 'string' ? element.value : JSON.stringify(element.value), type: typeof element.value })
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedValue, setSelectedValue] = useState(undefined);

  bucketList().then((data) => {
    let array = data.data
    let list = []
    for (let index = 0; index < array?.length; index++) {
      const element = array[index]
      list.push({ value: index, name: element, label: `[桶] ${element}` })
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
      // editable: false,
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
      valueType: 'textarea',
      render: (text, record) => {
        if (record.value?.length > 100) {
          return (<a onClick={() => showModal(text)}>{record.value?.substr(0, 100)}...</a>);
        }
        return text;
      },
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
            let result = await editBucketName([{ name: record.name, key: record.key, value: "" }])
            if (result.status === 200) {
              onSelect(selectedValue, setName, setDataSource)
              message.success('删除成功！', 1)
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const showModal = (content: any) => {
    setModalVisible(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
  };

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
            setSelectedValue(option.name)
            onSelect(option.name, setName, setDataSource)
          }
        }
        options={options}
      />
      {dataSource.length > 0 && <Button type="primary" onClick={() => { onSelect(selectedValue, setName, setDataSource) }}>刷新</Button>}
      <br />
      <br />
      {dataSource.length > 0 && <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle=""
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          record: { id: (Math.random() * 1000000).toFixed(0), name: name, num: dataSource.length + 1, type: '' },
        }}
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
            let list = []
            if (data.type == 'object') data.value = JSON.parse(data.value)
            if (data.key != row.key || data.name != row.name) {
              list = [{ name: row.name, key: row.key, value: '' }, { name: data.name, key: data.key, value: data.value }]
            } else {
              list = [{ name: data.name, key: data.key, value: data.value }]
            }
            let result = await editBucketName(list)
            if (result.status === 200) {
              // onSelect(selectedValue, setName, setDataSource)
              message.success('保存成功！', 1)
            }
          },
          onChange: setEditableRowKeys

        }}
      />}
      <div>
        <Modal title="" open={modalVisible} onCancel={closeModal} footer={null}>
          <br />
          <p>{modalContent}</p>
        </Modal>
      </div>
    </PageContainer>
  )
}

export default Welcome;

