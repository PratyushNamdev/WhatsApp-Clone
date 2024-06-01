import React, { useContext } from "react";
import style from "../../CSS/SingleChat.module.css";
import ChatContext from "../../Context/Chat/ChatContext";
import getTime from "../../Helper/getTime";
import AuthContext from "../../Context/Authentication/AuthContext";
import { MessageDoubleTickIcon , MessageOnGoingIcon , MessageSentIcon} from "../../Helper/icons";

export default function SingleChat({ chatData, chatUser }) {
  const { user } = useContext(AuthContext);
  const { setSelectedChat, selectedChat } = useContext(ChatContext);
  let time = "";
  if (chatData?.latestMessage) {
    time = getTime(chatData.latestMessage.createdAt);
  }
  let sender;
  if(chatData?.latestMessage?.sender?._id){
    sender = chatData?.latestMessage?.sender?._id;
  }
  else{
    sender = chatData?.latestMessage?.sender;

  }
  let isSender =  sender === user._id || false;
  let status;
  let tempDelivered = false;
          if (chatData?.latestMessage?.status === "timer") {
            status = "timer";
          } else {
            if(chatData?.isGroupChat === false){
              status = chatData.latestMessage?.recipients[0].status;
            }else{
              for (let i = 0; i < chatData.latestMessage?.recipients.length; i++) {
                if (chatData.latestMessage?.recipients[i].status === 'sent') {
                  status = 'sent';
                  tempDelivered =false;
                  break;
                }
                if(chatData.latestMessage?.recipients[i].status === 'delivered') {
                  tempDelivered = true;
                }
                
              }

              if(status === 'sent' && tempDelivered === false){
                   status = 'sent'
              } 
              else if(!status && tempDelivered === true){
                 status = 'delivered';
              }
              else{
                status = 'seen';
              }
            }
            
          }
  //let isSeen = (chatData?.isGroupChat === false && chatData?.latestMessage?.readBy.length > 0 )|| (chatData.isGroupChat === true && chatData?.latestMessage?.readBy.length >= chatData.users.length - 1 ) ;
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
          if(chatData.isGroupChat === false){
            let chat = {
              chatId: chatData._id,
              connectedUserIds:[chatUser._id],
              connectedUserName: chatUser.userName,
              connectedUserPic: chatUser?.profilePic?.url,
            };
            setSelectedChat(chat);
          }else{
            let recipientsIds = chatData.users.filter((chatUser) => {
              return user._id !== chatUser._id;
            }).map((user)=>{
              return user._id;
            });
           let chat = { 
            chatId  : chatData._id,
            connectedUserName: chatData.chatName,
            connectedUserPic: chatData?.groupDP?.url,
            connectedUserIds:recipientsIds
          }
          setSelectedChat(chat);

          }
         
            
        }}
      >
        <div className={style.imgBox}>
          {chatData.isGroupChat === false ? <img src={chatUser.profilePic.url} alt="profile Pic" /> : <img src={chatData?.groupDP?.url} alt="profile Pic" /> }
        </div>
        <div className={style.chatInfo}>
          <div>
           {chatData.isGroupChat === false ? <span>{chatUser.userName}</span> :  <span>{chatData.chatName}</span>}{" "}
            <span className={style.time}>{time}</span>{" "}
          </div>
          <div>
            <span className={style.latestMessage}>
              {chatData.latestMessage ? ( // Check if latestMessage exists
                <> { isSender && <span className={style.icon}>
                  {status === 'timer' ? (
                          <MessageOnGoingIcon />
                        ) : status === 'sent' ? (
                          <MessageSentIcon />
                        ) : status === 'delivered' ? (
                          <MessageDoubleTickIcon color="currentColor" />
                        ) : (
                          <MessageDoubleTickIcon color="#4FB6EC" />
                        )}
                  
                 </span>}
                 <span>{chatData.latestMessage.content} </span>
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
