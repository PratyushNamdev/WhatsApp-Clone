import React, { useContext, useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import AuthContext from "../../Context/Authentication/AuthContext";
import style from "../../CSS/ChatBox.module.css";
import {
  MessageSentIcon,
  MessageDoubleTickIcon,
  MessageOnGoingIcon,
} from "../../Helper/icons";
import ChatContext from "../../Context/Chat/ChatContext";

export default function ScrollableMessages({ messages }) {
  const { user } = useContext(AuthContext);
  const { messageSeen, setAllMessages } = useContext(ChatContext);
  useEffect(() => {
    let unSeenMessages = messages.filter((message) => {
      let targetRecipient =  message.recipients.find((recipient) => recipient.user._id === user._id);
     
      return (
         message.sender._id !== user._id &&
         targetRecipient?.status !== 'seen'
      );
    });

  
    if (unSeenMessages.length > 0) {
   
      unSeenMessages.forEach((msg) => {
        msg.recipients.forEach((recipient) => {
          if (recipient.user._id === user._id) {
            recipient.status = "seen";
          }
        });
      });

      const updatedMessages = messages.map((stateObj) => {
        const matchingObj = unSeenMessages.find(
          (otherObj) => otherObj._id === stateObj._id
        );
        return matchingObj ? matchingObj : stateObj;
      });

      setAllMessages(updatedMessages);

      messageSeen(unSeenMessages);

      unSeenMessages = [];
    }
    //eslint-disable-next-line
  }, [messages]);

  return (
    <ScrollableFeed forceScroll={true} className={style.scrollableFeed}>
      {messages &&
        messages.map((message) => {
          const date = new Date(message.createdAt);
          const options = {
            timeZone: "Asia/Kolkata",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          };
          const time = date.toLocaleTimeString("en-US", options);
          const messageClass =
            message.sender._id === user._id
              ? style.rightMessage
              : style.leftMessage;


          let status;
          let tempDelivered = false
          if (message?.status === "timer") {
            status = "timer";
          } else {
            if(message.chatId.isGroupChat === false){
              status = message.recipients[0].status;
            }else{
              for (let i = 0; i < message?.recipients.length; i++) {
                if (message.recipients[i].status === 'sent') {
                  status = 'sent';
                  tempDelivered =false;
                  break;
                }
                if(message.recipients[i].status === 'delivered') {
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
          const isSender = message.sender._id === user._id;

          

          return (
            <div
              className={`  ${style.singleMessageWrapper}`}
              key={message._id}
            >
              <div className={` ${messageClass} ${style.textContainer}`}>
                <div>
                  {message.chatId.isGroupChat === true &&
                    message.sender._id !== user._id && (
                      <div>{message.sender.userName} </div>
                    )}
                  <div className={style.box}>
                    <span className={style.text}>{message.content}</span>
                    <span className={style.time}>{time}</span>
                    {isSender && (
                      <span className={style.icon}>
                        {status === 'timer' ? (
                          <MessageOnGoingIcon />
                        ) : status === 'sent' ? (
                          <MessageSentIcon />
                        ) : status === 'delivered' ? (
                          <MessageDoubleTickIcon color="currentColor" />
                        ) : (
                          <MessageDoubleTickIcon color="#4FB6EC" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
}
