import React, { useContext, useEffect } from "react";
import style from "../../CSS/SingleChat.module.css";
import ChatContext from "../../Context/Chat/ChatContext";
import getTime from "../../Helper/getTime";
//import AuthContext from "../../Context/Authentication/AuthContext";

export default function SingleChat({ chatData, chatUser }) {
  //const { user } = useContext(AuthContext);
  const { setSelectedChat, selectedChat } = useContext(ChatContext);
  let time = "";
  if (chatData?.latestMessage) {
    time = getTime(chatData.latestMessage.createdAt);
  }

  useEffect(() => {
    if (chatData.latestMessage) {
      if (chatData.unseenMessageCount > 0) {
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        className={style.chatWrapper}
        onClick={() => {
          if (selectedChat) {
            if (chatData._id === selectedChat.chatId) {
              return;
            }
          }
          chatData.unseenMessageCount = null;
          let chat = {
            chatId: chatData._id,
            connectedUserName: chatUser.userName,
            connectedUserPic: chatUser?.profilePic?.url,
          };
          setSelectedChat(chat);
        }}
      >
        <div className={style.imgBox}>
          <img src={chatUser.profilePic.url} alt="profile Pic" />
        </div>
        <div className={style.chatInfo}>
          <div>
            <span>{chatUser.userName}</span>{" "}
            <span className={style.time}>{time}</span>{" "}
          </div>
          <div>
            <span className={style.latestMessage}>
              {chatData.latestMessage ? ( // Check if latestMessage exists
                <>
                 
                  {chatData.latestMessage.content}{" "}
               
                </>
              ) : (
                "No messages yet" // Placeholder text if there are no messages
              )}
            </span>
            {chatData.unseenMessageCount && chatData.unseenMessageCount > 0 ? (
              <span className={style.unseenMessageCount}>
                {chatData?.unseenMessageCount}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
