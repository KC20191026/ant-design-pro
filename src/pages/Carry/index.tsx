import React, { useRef, useState } from 'react';
import { Button, Space, Switch, Tabs, Tag, Tooltip } from 'antd';
import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText, ProTable } from '@ant-design/pro-components';
import { carryList, delCarryGroup, editCarryGroup } from '@/services/ant-design-pro/bucket';
import message from 'antd/lib/message';
import { addRule } from '@/services/ant-design-pro/api';

const Welcome: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectVisible, setSelectVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const tableRef = React.useRef();

  const operations =
    <Tooltip title="此处填写包含词。采集群和转发群将忽略不含有任意包含词的消息。支持正则，需要使用“/”将正则表达式包起来。">
      <Button>提示</Button>
    </Tooltip>;

  const handleSwitchChange = (checked: any) => {
    setSelectVisible(checked); // 更新状态来管理显示/隐藏
  };

  const changeCarryStatus = (chat_id: any, enable: any) => {
    enable = !enable
    tableRef.current?.reload()
    editCarryGroup({ chat_id, enable })
  }

  const items = [
    {
      label: `包含词`,
      key: '1',
      children:
        <Button
          type="dashed"
          // onClick={() => add()}
          style={{ width: '20%' }}
        >
          +增加
        </Button>,
    },
    {
      label: `排除词`,
      key: '2',
      children: `Content of tab 2`,
    }]

  const columns: ProColumns[] = [
    // {
    //   title: '编号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   // render: (text) => <a>{text}</a>,
    // },
    {
      title: '群组ID',
      dataIndex: 'chat_id',
      key: 'chat_id',
    },
    {
      title: '群名',
      dataIndex: 'chat_name',
      key: 'chat_name',
      render: (_, { chat_name }) => (
        <>
          {chat_name ? chat_name : '-'}
        </>
      ),
    },
    {
      title: '平台',
      key: 'platform',
      dataIndex: 'platform',
      render: (_, { platform }) => (
        <>
          <Tag color='purple' key={platform}>
            {platform}
          </Tag>
        </>
      ),
    },
    {
      title: '模式',
      key: 'model',
      dataIndex: 'model',
      render: (text, record) => (
        <>
          {
            record.in && <Tag color={'blue'}>
              {'采集'}
            </Tag>
          }
          {
            record.out && <Tag color={'geekblue'}>
              {'转发'}
            </Tag>
          }
        </>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '创建日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, { created_at }) => (
        <>
          {new Date(created_at).getFullYear()}/{new Date(created_at).getMonth() + 1}/{new Date(created_at).getDate()}
        </>
      ),
    },
    {
      title: '启用',
      dataIndex: 'enable',
      key: 'enable',
      render: (text, record) => (
        <Switch checked={record.enable} onChange={() => { changeCarryStatus(record.chat_id, record.enable) }} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            formRef.current?.setFieldsValue(record);
            handleModalOpen(true);
          }}
          >编辑</a>
          <a onClick={async () => { delCarryGroup({ chat_id: record.chat_id }) }}>删除</a>
        </Space>
      ),
    },
  ];

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.RuleListItem) => {
    console.log(fields)
    const hide = message.loading('正在添加');
    try {
      await addRule({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  return (
    <PageContainer
      header={{
        children: '搬运群组',
      }}>
      <div>
        <Button onClick={() => { formRef.current?.resetFields([]); handleModalOpen(true); }} type="primary" style={{ marginBottom: 16 }}>
          + 新建一行
        </Button>
        <ProTable
          columns={columns}
          request={(params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            // console.log(params, sorter, filter);
            return Promise.resolve(carryList());
          }}
          actionRef={tableRef}
          rowKey="key"
          pagination={{
            showQuickJumper: true,
          }}
          search={false}
          dateFormatter="string"
        />
      </div>

      <ModalForm
        title="创建"
        width="520px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm
          title="新建表单"
          submitter={false}
          formRef={formRef}>

          <ProFormText
            width="xl"
            name="chat_id"
            label="群组ID"
            tooltip="系统唯一不可更改，只能删除。"
            placeholder="请输入群组ID"
            required
          />
          <ProForm.Group>
            <ProFormText
              width="sm"
              name="remark"
              label="群组备注"
              placeholder="请输入群组备注"
            />
            <ProFormText
              width="sm"
              name="chat_name"
              label="群名称"
              placeholder="请输入群名称"
              disabled
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              options={[
                {
                  value: 'chapter',
                  label: '盖章后生效',
                },
              ]}
              width="sm"
              name="platform"
              label="通信平台"
              tooltip="平台接入系统后将自动出现在列表中。"
              required
            />
            <ProFormSwitch
              width="sm"
              name="in"
              label="采集模式"
              tooltip="开启后将在此群聊监听消息，但机器人同时不再回复该群聊指令，但是不影响消息推送。开启此模式的一般是别人的群。"
            />
            <ProFormSwitch
              width="sm"
              name="out"
              label="转发模式"
              tooltip="开启后将在此群转发消息。开启此模式的群一般是自己的群。"
              fieldProps={{
                onChange: handleSwitchChange, // 监听开关状态变化
              }}
            />
          </ProForm.Group>
          {selectVisible && (
            <ProFormSelect
              options={[
                {
                  value: 'chapter',
                  label: '盖章后生效',
                },
              ]}
              width="xl"
              name="form"
              label="采集源"
              tooltip="指定要进行消息采集的群聊。"
            />
          )}
          <ProFormText width="xl" name="bots_id" label="工作机器人" tooltip="指定要进行消息采集和转发的机器人，同一消息同时只允许一个机器人工作，如果指定的机器人离线则采用其他机器人顶上。此外，采集模式中只有第一个ID有效。" />
          <ProFormSelect
            options={[
              {
                value: 'chapter',
                label: '盖章后生效',
              },
            ]}
            width="xl"
            name="scripts"
            label="处理脚本"
            tooltip="可以顺序通过脚本处理发送前的消息。"
          />
          <ProFormText width="xl" name="allowed" label="白名单" tooltip="此处填白名单用户ID。采集群只接收来自白名单用户消息，转发群只转发来自白名单用户消息。设置白名单将忽略黑名单。" />
          <ProFormText width="xl" name="prohibited" label="黑名单" tooltip="此处填黑名单用户ID。采集群和转发群将忽略黑名单用户所有消息。" />
          <ProForm.Group>
            <ProFormSwitch
              width="xs"
              name="deduplication"
              label="文本去重"
              tooltip="开启后将会对文本消息、图文消息进行去重，不保证十分准确。"
            />
            <ProFormSwitch
              width="xs"
              name="deduplication2"
              label="图片去重"
              tooltip="待实现，占个位置，开启后将会对图片消息进行去重，对计算机性能有较高要求。"
            />
          </ProForm.Group>
          <Tabs tabBarExtraContent={operations} items={items} /*onChange={}*/ />
        </ProForm>
      </ModalForm>
    </PageContainer>
  )
}

export default Welcome;