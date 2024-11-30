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

  const [botMessages, setMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [isTyping, setTyping] = useState(false);

  const handleSendMessage = (text) => {
    const userMessage = {
      message: text,
      sentTime: "just now",
      sender: "User",
      direction: "outgoing",
      position: "first",
      timestamp: new Date().getTime(),
    }
    setUserMessages(prevMessages => [...prevMessages, userMessage]);
    setTyping(true);

    axios.post('https://pro-gogh.onrender.com', { text: text }).then((response) => {
      const viewerMessages = {
        message: response.data.viewer,
        sentTime: "just now",
        sender: "Viewer",
        direction: "incoming",
        position: "first",
        avatar: ViewerImage,
        name: "鑑賞者AI",
        timestamp: new Date().getTime(),
      };

      const facilitatorMessages = {
        message: response.data.facilitator,
        sentTime: "just now",
        sender: "Facilitator",
        direction: "incoming",
        position: "first",
        avatar: FaslitatorImage,
        name: "ファシリテータAI",
        timestamp: new Date().getTime() + 1,
      };

      setMessages(prevMessages => [...prevMessages, viewerMessages]);

      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMessages(prevMessages => [...prevMessages, facilitatorMessages]);
        }, 6000);
      }, 1000);
    })
      .catch((error) => {
        setTyping(false);
        console.error("Error sending data: ", error);
      });
  };

  const allMessages = [...userMessages, ...botMessages].sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" >
      <Box flex={1} minWidth={300} p={1} boxSizing="border-box">
        <div style={{
          height: "100vh",
          position: "relative"
        }}>
          <MainContainer responsive>
            <ChatContainer>

              {/* ヘッダー部分 */}
              <ConversationHeader>
                <ConversationHeader.Content
                  userName="対話型鑑賞をしましょう"
                  info="題材絵画：ゴッホ作《星月夜》"
                />
              </ConversationHeader>

              {/* メッセージリスト */}
              <MessageList>
                <Message
                  model={{
                    message: "フィンセント・ファン・ゴッホ作《星月夜》について対話型鑑賞をしましょう。私はファシリテータとして質問をします",
                    sentTime: "just now",
                    sender: "Facilitator",
                    direction: "incoming",
                    position: "first",
                  }}>
                  <Avatar src={FaslitatorImage} />
                  <Message.Footer sender="ファシリテータAI" />
                </Message>
                <Message
                  model={{
                    message: "私も対話型鑑賞に参加します！一緒に鑑賞しましょう！",
                    sentTime: "just now",
                    sender: "Viewer",
                    direction: "incoming",
                    position: "first",
                  }}>
                  <Avatar src={ViewerImage} />
                  <Message.Footer sender="鑑賞者AI" />
                </Message>
                <Message
                  model={{
                    message: "まず最初に、この絵を見てどのような感情になりましたか？",
                    sentTime: "just now",
                    sender: "Facilitator",
                    direction: "incoming",
                    position: "first",
                  }}>
                  <Avatar src={FaslitatorImage} />
                  <Message.Footer sender="ファシリテータAI" />
                </Message>

                {allMessages.map((msg, index) => (
                  <Message key={index} model={msg}>
                    {msg.sender !== "User" && <Avatar src={msg.avatar} />}
                    {msg.sender !== "User" && <Message.Footer sender={msg.name} />}
                  </Message>
                ))}
              </MessageList>

              {/* メッセージ入力窓 */}
              <MessageInput placeholder="Type message here" attachButton={false} onSend={handleSendMessage} />

            </ChatContainer>
          </MainContainer>
        </div>
      </Box>

      <Box flex={1} minWidth={300} p={1} boxSizing="border-box">
        <MainImage>
          <ImagePreview src={goghImage} />
        </MainImage>
      </Box>
    </Box>
  );
}

export default App;
