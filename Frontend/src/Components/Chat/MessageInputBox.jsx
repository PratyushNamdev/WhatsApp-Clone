import React, { useState , useContext } from "react";
import { EmojiIcon, AddFileIcon, SendIcon } from "../../Helper/icons";
import style from "../../CSS/ChatBox.module.css";
import EmojiPicker from "emoji-picker-react";
import apiEndpoints from "../../Helper/apiEndpoints";
import HOST from "../../Helper/host";
import ChatContext from "../../Context/Chat/ChatContext";
import AuthContext from "../../Context/Authentication/AuthContext"
export default function MessageInputBox({ selectedChat  , socket}) {
  const {user} = useContext(AuthContext)
  const {setAllMessages , setChatList , chatList} = useContext(ChatContext)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [content, setContent] = useState("");
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };
  const handleTyping = (e) => {
    setContent(e.target.value);
  };
  const handleEmojiClick = (e) => {
    setContent((prevContent)=>prevContent+e.emoji)
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (content.trim() === "") {
      return;
    }
    let message = content;
    setContent("");
    const temporaryMessage = {
      _id: Math.random() * 1000,
      content:message,
      sender:{_id:user._id},
      createdAt:Date.now(),
     chatId:{ isGroupChat:false},
     recipients:[],
     status:'timer',
   
    }
     const tempChatIndex = chatList.findIndex(chat => chat._id === selectedChat.chatId);
    let tempChatList = [...chatList]
    tempChatList[tempChatIndex].latestMessage = temporaryMessage;
   
    let tempChat = tempChatList.splice(tempChatIndex, 1)[0];
    tempChatList.unshift(tempChat);
    setChatList(tempChatList);
 
    setAllMessages((prevMessage)=>[...prevMessage ,temporaryMessage])
    try {
      const response = await fetch(`${HOST}${apiEndpoints.messages.sendMessage}`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          content:message,
          chatId: selectedChat.chatId,
          recipientIds: selectedChat.connectedUserIds
        }),
      });
      const data = await response.json();
    
      if(data?.error){
        throw data.message;
      }
     console.log(data)
      setAllMessages((prevMessage)=>{
        const updatedMessages = prevMessage.filter((message)=> message !== temporaryMessage)
         return[...updatedMessages , data.message]
      })
      setChatList(prevChat => {
        const updatedChatList = prevChat.filter(chat => chat._id !== selectedChat.chatId);
        return [{...data.updatedChat}, ...updatedChatList];
      });
   
      socket.emit("new message" , data);
     
    } catch (e) {
      console.log(e);
    }
  };

 
  return (
    <div style={{ width: "100%" }}>
      {showEmojiPicker && (
        <EmojiPicker
          theme="dark"
          width={"100%"}
          className={style.emojiPickerContainer}
          onEmojiClick={handleEmojiClick}
        />
      )}

      <div className={style.inputContainer}>
        <div onClick={toggleEmojiPicker}>
          <EmojiIcon />
        </div>
        <div>
          <AddFileIcon />
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={content} onChange={handleTyping} />
          <button type="submit">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
