import React, { useState } from 'react';
import "./App.css";
import ImagePreview from './Components/ImagePreview';
import axios from "axios";
import { MainImage } from './styles/styles';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import goghImage from './Components/images/Gogh.jpg';
import FaslitatorImage from './Components/images/Facilitator.png';
import ViewerImage from './Components/images/Viewer.png';
import Box from '@mui/material/Box';

function App() {

  //メッセージの格納リスト
  //ボットstateの初期化
  const [botMessages, setMessages] = useState([]);
  //ユーザメッセージstate
  const [userMessages, setUserMessages] = useState([]);

  //タイピングインジケータの制御のstate
  const [isTyping, setTyping] = useState(false);

  // 新しいメッセージを追加する関数コンポーネント
  const handleSendMessage = (text) => {

    // ユーザのメッセージ
    const userMessage = {
      message: text,
      sentTime: "just now",
      sender: "User",
      direction: "outgoing",
      position: "first",
      timestamp: new Date().getTime(), //メッセージ順に表示するために
    }
    setUserMessages(prevMessages => [...prevMessages, userMessage]);

    //ユーザがメッセージを送信したのでインジケータをtrueにする
    setTyping(true);

    // ボットの応答を取得
    axios.post('https://pro-gogh.onrender.com', { text: text }).then((response) => {
      const viewerMessages = {
        message: response.data.viewer,
        sentTime: "just now",
        sender: "Viewer",
        direction: "incoming",
        position: "first",
        avatar: ViewerImage, // Viewerのアバター画像を設定
        name: "Viewer", // Viewerの名前を設定
        timestamp: new Date().getTime(), //メッセージ順に表示するために
      };

      const facilitatorMessages = {
        message: response.data.facilitator,
        sentTime: "just now",
        sender: "Facilitator",
        direction: "incoming",
        position: "first",
        avatar: FaslitatorImage, // Facilitatorのアバター画像を設定
        name: "Facilitator", // Facilitatorの名前を設定
        timestamp: new Date().getTime() + 1, // Slightly later to ensure order
      };

      // まずviewerMessagesを追加
      setMessages(prevMessages => [...prevMessages, viewerMessages]);

      // タイピングインジケータを表示し、数秒後に非表示にする
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          // 数秒後にfacilitatorMessagesを追加
          setMessages(prevMessages => [...prevMessages, facilitatorMessages]);
        }, 6000); // タイピングインジケータ表示時間
      }, 1000); // viewerMessages表示後の遅延
    })
      .catch((error) => {
        setTyping(false);
        console.error("Error sending data: ", error);
      });
  };

  const allMessages = [...userMessages, ...botMessages].sort((a, b) => {
    // ソートロジック
    return a.timestamp - b.timestamp;
  });

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" >
      <Box flex={1} minWidth={300} p={1} boxSizing="border-box">
        <div style={{
          height: "100vh",
          position: "relative"
        }}>
          {/*チャット部分*/}
          <MainContainer responsive>

            <ChatContainer>

              {/*ヘッダー部分*/}
              <ConversationHeader>
                <ConversationHeader.Content
                  userName="Facilitator"
                  info="対話型鑑賞をしましょう"
                />
              </ConversationHeader>

              {/*メッセージリスト*/}
              <MessageList>
                <Message
                  model={{
                    message: "フィンセント・ファン・ゴッホ作《星月夜》について対話型鑑賞をしましょう",
                    sentTime: "just now",
                    sender: "Facilitator",
                    direction: "incoming",
                    position: "first",
                  }}>
                  <Avatar src={FaslitatorImage} />
                </Message>

                <Message
                  model={{
                    message: "まず最初に、この絵を見てどのような感情になりましたか？",
                    sentTime: "just now",
                    sender: "Facilitator",
                    direction: "incoming",
                    position: "first",
                  }}
                  avatarSpacer={true}
                >
                  <Message.Footer sender="Facilitator" />
                </Message>

                {allMessages.map((msg, index) => (
                  <Message key={index} model={msg}>
                    {msg.sender !== "User" && <Avatar src={msg.avatar} />}
                    {msg.sender !== "User" && <Message.Footer sender={msg.name} />}
                  </Message>
                ))}
                {isTyping && <TypingIndicator content="ただいま考え中・・・" />}
              </MessageList>

              {/*メッセージ入力窓*/}
              <MessageInput placeholder="Type message here" attachButton={false} onSend={handleSendMessage} />

            </ChatContainer>
          </MainContainer>
        </div>
      </Box>

      <Box flex={1} minWidth={300} p={1} boxSizing="border-box">
        {/*画像表示部分*/}
        <MainImage>
          <ImagePreview src={goghImage} />
        </MainImage>
      </Box>
    </Box>
  );
}

export default App;
