import { ModalForm, PageContainer, ProForm, ProFormDigit, ProFormInstance, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import moment from 'moment';
import { useParams } from 'umi';
import { Button, message } from 'antd';
import { getPlugin, editPlugin } from '@/services/ant-design-pro/script';
import { getStorage, setStorage } from '@/services/ant-design-pro/bucket';


function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}

const Welcome: React.FC = () => {

  const defaultC = `/**
  * @title 无名脚本
  * @create_at ${moment().format('YYYY-MM-DD HH:mm:ss')}
  * @description 🐒这个人很懒什么都没有留下。
  * @author 佚名
  * @version v1.0.0
  */`

  const [title, setTitle] = useState("+新增脚本");
  const [defaultContent, setDefaultContent] = useState(defaultC);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();
  const [formData, setFormData] = useState({});
  const [formItems, setFormItems] = useState([]);
  
  let editStr = ""
  let params = useParams()
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    editor.setValue(defaultC)
    // console.log(params)
    if (params.id) {
      if (params.id === ":id") {
        // console.log("走默认")
      } else {
        getPlugin(params.id).then((data) => {
          const reg = "/\\*(.|\\r\\n|\\n)*?\\*/"
          const res = data.data.content?.match(reg);
          const form = res[0]?.match(/@form.*/g)
          if (form) {
            for (let f of form) {
              f = f?.replace('@form ', '')
              f = new Function('return' + f)()
              formItems.push(f)
            }
            setFormItems(formItems);
          }
          if (data.status === 200) {
            setTitle(data.data.title)
            editor.setValue(data.data.content)
          }
        })
      }
    } else {
      editor.setValue(defaultC)
    }
  }

  const handleOpen = () => {
    getStorage(formItems.map(obj => obj.key).join(',')).then((data) => {
      setFormData(data.data)
      handleModalOpen(true);
    })
  }

  function handleEditorChange(value: any, event: any) {
    editStr = value
  }

  return (
    <PageContainer
      header={{
        title: title,
      }}
    >
      <div>
        <Button type="primary" style={{ float: "right", margin: 10 }} onClick={async () => {
          let data = editorRef?.current?.getValue()
          if (params.id) {
            let result = await editPlugin(params.id, data)
            if (result.status === 200) {
              message.success('保存成功!');
            }
          } else {
            let result = await editPlugin(params.id ?? uuid(), data)
            if (result.status === 200) {
              message.success('保存成功!');
            }
          }
        }} >保存</Button>
        <Button type="primary" style={{ float: "right", margin: 10 }} onClick={async () => { handleOpen(); }}>表单</Button>
      </div>
      <Editor height="80vh" defaultLanguage="javascript" defaultValue={defaultContent} theme="vs-light" options={{ fontSize: 12, }}
        onChange={handleEditorChange} onMount={handleEditorDidMount} />
      <ModalForm
        title="参数配置"
        width="520px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (values) => {
          const result = await setStorage(formRef.current?.getFieldsFormatValue?.())
          if (result.status == 200) {
            message.success('保存成功!');
            return true
          } else {
            message.success('保存失败!');
          }
        }}
      >
        <ProForm
          submitter={{
            render: () => null, // 清空按钮
          }}
          formRef={formRef}
          initialValues={formData}
        >
          {formItems.map((item: any) => (
            <>
              {
                item.valueType === 'switch' &&
                <ProFormSwitch
                  width="xs"
                  name={item.key}
                  label={item.title}
                  tooltip={item.tooltip}
                  required={item.required ?? false}
                /> ||
                item.valueType === 'digit' &&
                <ProFormDigit
                  width="xs"
                  name={item.key}
                  label={item.title}
                  tooltip={item.tooltip}
                  required={item.required ?? false}
                /> ||
                !item.valueType &&
                <ProFormText
                  width="xl"
                  name={item.key}
                  label={item.title}
                  tooltip={item.tooltip}
                  required={item.required ?? false}
                />
              }
            </>
          ))}
        </ProForm>
      </ModalForm>
    </PageContainer>
  );
};

export default Welcome;
