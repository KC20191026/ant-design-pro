import { PageContainer } from '@ant-design/pro-components';
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import moment from 'moment';
import { useParams } from 'umi';
import { Button } from 'antd';
import { getPlugin,  editPlugin } from '@/services/ant-design-pro/script';


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

  const [title, setTitle] = useState("新增插件");
  const [defaultContent, setDefaultContent] = useState(defaultC);

  let editStr = ""
  let params = useParams()
  params.uuid = uuid()
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
    // console.log(editor)
    // console.log(editor.getValue())
    editor.setValue(defaultC)
    console.log(params)
    if (params.id) {
      if (params.id === ":id") {
        // console.log("走默认")
      } else {
        // 获取插件详情
        // console.log("发送请求")
        getPlugin(params.id).then((data) => {
          console.log(data)
          if (data.status === 200) {
            setTitle(data.data.title)
            // setDefaultContent(data.data.content)
            editor.setValue(data.data.content)
          }
        })
      }
    }else {
      editor.setValue(defaultC)
    }

  }

  function handleEditorChange(value, event) {
    editStr = value
  }

  return (
    <PageContainer
      header={{
        title: title,
        extra: [
          <Button key="1" type="primary" style={{ float: "right", margin: 10 }} onClick={ ()=>{
            let data = editorRef.current.getValue()
            if (params.id){
              editPlugin(params.id, data)
            }else {
              editPlugin(params.uuid, data)
            }
            
          }} >保存</Button>
        ],
      }}
    >
      {/* <div>
        <Button type="primary" style={{ float: "right", margin: 10 }} >保存</Button>
      </div> */}

      <Editor height="90vh" defaultLanguage="javascript" defaultValue={defaultContent}
        onChange={handleEditorChange} onMount={handleEditorDidMount} />
    </PageContainer>
  );
};

export default Welcome;
