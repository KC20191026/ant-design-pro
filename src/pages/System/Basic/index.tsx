import { getStorage, setStorage } from '@/services/ant-design-pro/bucket';
import { PageContainer, ProForm, ProFormDigit, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Input, InputNumber, message } from 'antd';
import React, { useRef, useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const Welcome: React.FC = () => {
  const formRef = useRef<
    ProFormInstance<{
      name: string;
      company?: string;
      useMode?: string;
    }>
  >();
  const [formData, setFormData] = useState({});


  return (
    <PageContainer
      header={{
        title: '基础配置',
      }}>
      <ProForm
        onFinish={async (values: any) => {
          const result = await setStorage(values)
          if (result.status == 200) {
            message.success('保存成功!');
            return true
          } else {
            message.success('保存失败!');
          }
        }}
        formRef={formRef}
        initialValues={formData}
        params={{ id: '100' }}
        formKey="base-form-use-demo"
        dateFormatter={(value, valueType) => {
          console.log('---->', value, valueType);
          return value.format('YYYY/MM/DD HH:mm:ss');
        }}
        request={async () => {
          return new Promise(resolve => getStorage(['system.name', 'system.port', 'system.password', 'system.startTime'].join(',')).then((data) => {
            setFormData(data.data)
            resolve(data.data)
          })
          )
        }}
        submitter={false}
      >
        <ProForm.Group>
          <ProForm.Item
            label="登录账号"
            tooltip="机器人名称"
            name="system.name"
          >
            <Input onBlur={() => formRef.current?.submit()} />
          </ProForm.Item>
          <ProForm.Item
            label="登录密码"
            tooltip="主要用于管理员页面登录"
            name="system.password"
          >
            <Input onBlur={() => formRef.current?.submit()} />
          </ProForm.Item>
          {/* <ProFormText
            width="md"
            name="system.name"
            label="登录账号"
            tooltip="机器人名称"
            placeholder="请输入名称"
          />
          <ProFormText
            width="md"
            name="system.password"
            label="登录密码"
            placeholder="请输入密码"
            tooltip="主要用于管理员页面登录"
          /> */}
        </ProForm.Group>
        <ProForm.Group>
          <ProForm.Item
            label="端口"
            tooltip="请谨慎修改，如果因此无法访问请重新运行程序并修改端口。"
            name="system.port"
          >
            <InputNumber onBlur={() => formRef.current?.submit()} />
          </ProForm.Item>
          <ProForm.Item
            label="启动时间"
            name="system.startTime"
          >
            <Input disabled />
          </ProForm.Item>
          {/* <ProFormDigit
            name='system.port'
            width="md"
            label="端口"
            placeholder="请输入"
            tooltip="请谨慎修改，如果因此无法访问请重新运行程序并修改端口。"
          />
          <ProFormText
            width="md"
            name="system.startTime"
            disabled
            label="启动时间"
            initialValue=""
          /> */}
        </ProForm.Group>
      </ProForm>
    </PageContainer >
  )
}

export default Welcome;