import { useState } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  Navigator,
  Image,
  Editor,
} from "@tarojs/components";
import { AtList, AtListItem, AtButton } from "taro-ui";

import img from "../../../static/img.jpg";
import "./message.scss";

function Message() {
  const [editor, setEditor] = useState("");

  //输入框内容
  const [msg, setMsg] = useState("");

  //输入框
  const handleInput = (e) => {
    setMsg(e.target.value)
    console.log(e);
    console.log(e.detail.html);
    console.log(e.detail.text);
    console.log(e.detail.delta);
  };

  //发送按钮
  const handleSend = async () => {
    const sendMsg = msg;
    console.log(sendMsg)
  };
  const editorReady = () => {
    Taro.createSelectorQuery()
      .select("#editor")
      .context((res) => {
        let newData = res.context;
        setEditor(newData);
      })
      .exec();
  };
  const addImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album"],
      success: (res) => {
        editor.insertImage({
          src: res.tempFilePaths[0],
          width: "60%",
          success: () => {
            console.log("success");
          },
        });
      },
    });
  };

  return (
    <View className='index'>
      <View className='components-page'>
        <View className='operate-box' onClick={() => addImage()}>
          {/* 插入图片 */}
          <Image className='img' src={img} />
          <Text className='img-name'>点击插入图片</Text>
        </View>
        <View className='editor-box'>
          <Editor
            id='editor'
            className='editor'
            placeholder='please input...'
            onReady={() => editorReady()}
            onInput={(e) => handleInput(e)}
          ></Editor>
        </View>
      </View>
      <View className='choose-user'>
        <Navigator url='/pages/class/notice/message/chooseUser/chooseUser'>
        <View>
          <AtList>
              <AtListItem title='请选择指定用户' note='-标签：一年级一班' arrow='right' />
            </AtList>
        </View>
        </Navigator>
        <View className='bottom'>
          <Navigator url='/pages/class/notice/message/history/history'>
          <Text className='text'>历史记录</Text>
          </Navigator>
          <AtButton
            type='primary'
            className='send-button'
            onClick={() => handleSend()}
          >
          发送
        </AtButton>
        </View>
      </View>
    </View>
  );
}
export default Message;