import { PageContainer } from '@ant-design/pro-components';
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import moment from 'moment';
import { useParams } from 'umi';
import { Button, message } from 'antd';
import { getPlugin, editPlugin } from '@/services/ant-design-pro/script';


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
  const [messageApi, contextHolder] = message.useMessage();

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
          console.log(data)
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

  function handleEditorChange(value: any, event: any) {
    editStr = value
  }

  return (
    <PageContainer
      header={{
        title: title,
        extra: [
          <Button key="1" type="primary" style={{ float: "right", margin: 10 }} onClick={async () => {
            let data = editorRef.current.getValue()
            if (params.id) {
              let result = await editPlugin(params.id, data)
              if (result.status === 200) {
                messageApi.open({
                  type: 'success',
                  content: '保存成功！',
                });
              }
            } else {
              let result = await editPlugin(params.id ?? uuid(), data)
              if (result.status === 200) {
                messageApi.open({
                  type: 'success',
                  content: '保存成功！',
                });
              }
            }
          }} >保存</Button>
        ],
      }}
    >
      {/* <div>
        <Button type="primary" style={{ float: "right", margin: 10 }} >保存</Button>
      </div> */}

      <Editor height="67vh" defaultLanguage="javascript" defaultValue={defaultContent} theme="vs-light" options={{ fontSize: 12, }}
        onChange={handleEditorChange} onMount={handleEditorDidMount} />
    </PageContainer>
  );
};

export default Welcome;
