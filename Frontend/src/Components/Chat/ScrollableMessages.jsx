import React, { useContext , useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import AuthContext from "../../Context/Authentication/AuthContext";
import style from "../../CSS/ChatBox.module.css";
import { MessageSentIcon , MessageDoubleTickIcon, MessageOnGoingIcon } from "../../Helper/icons";
import ChatContext from "../../Context/Chat/ChatContext";

export default function ScrollableMessages({ messages }) {
  const { user } = useContext(AuthContext);
  const {messageSeen} = useContext(ChatContext);
 
  
  
  useEffect(()=>{
   
    const message = messages.filter(message => 
      message.sender._id !== user._id && 
      message.chatId.isGroupChat === false && 
      message.readBy.length <= 0
    );
    if(message.length > 0) {
        messageSeen(message)

    }
    // eslint-disable-next-line
  },[messages])
  return (
    <ScrollableFeed forceScroll={true} className={style.scrollableFeed}>
      {messages &&
        messages.map((message) => {
         let messageOngoing = message?.messageTimer;
         let messageDelivered = message?.messageDelivered
          const messageClass =
            message.sender._id === user._id
              ? style.rightMessage
              : style.leftMessage;
          const date = new Date(message.createdAt);
          const options = {
            timeZone: "Asia/Kolkata",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          };
          const time = date.toLocaleTimeString("en-US", options);
          const isSender =  message.sender._id === user._id;
          const isSeen = message.chatId.isGroupChat === false && message.readBy.length > 0 ;
          return (
            <div className={`  ${style.singleMessageWrapper}`} key={message._id}>
              <div className={` ${messageClass} ${style.textContainer}`}>
                  <div>
                      <div className={style.box}>
                          <span className={style.text}>{message.content}</span> 
                          <span className={style.time}>{time}</span>
                         { isSender && <span className={style.icon}>
                         {messageDelivered ? <MessageDoubleTickIcon color="gray" /> :  isSeen ?( <MessageDoubleTickIcon  color="#4FB6EC"/>): (messageOngoing ? <MessageOnGoingIcon/>: <MessageSentIcon/>)}
                          </span>}
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
}
