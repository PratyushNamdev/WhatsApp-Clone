import React, { useContext, useEffect } from "react";
import ChatContext from "../../Context/Chat/ChatContext";
import { MenuIcon } from "../../Helper/icons";
import style from "../../CSS/ChatBox.module.css";
//import InfiniteScroll from "react-infinite-scroll-component";
import AuthContext from "../../Context/Authentication/AuthContext";
import ScrollableMessages from "./ScrollableMessages";
import MessageInputBox from "./MessageInputBox";
import useSound from "use-sound";
import Notification from "../../Helper/Notification.mp3";
import SocketContext from "../../Context/Socket/SocketContext";
import Loading from "../General/Loading";
var selectedChatCompare, currentChatList, notification, currentAllMessages;
export default function ChatBox() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [sound] = useSound(Notification);
  notification = sound;
  const {
    selectedChat,
    fetchMessages,
    allMessages,
    
    setAllMessages,
    chatList,
    setChatList,
    isMessagesLoading
  } = useContext(ChatContext);
  currentChatList = chatList;

  currentAllMessages = allMessages;
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId, socket);
      //messageSeen(selectedChat.chatId);
      selectedChatCompare = selectedChat;
    }

    socket.emit("setup", user);

    //eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        selectedChatCompare &&
        selectedChatCompare.chatId === newMessageRecieved.message.chatId._id
      ) {
        setAllMessages((prevMessage) => {
          return [...prevMessage, newMessageRecieved.message];
        });

        const foundChatIndex = currentChatList.findIndex(
          (chat) => chat._id === newMessageRecieved.message.chatId._id
        );

        const updatedChatList = [...currentChatList];
        updatedChatList[foundChatIndex].unseenMessageCount = 0;
        updatedChatList[foundChatIndex].latestMessage =
          newMessageRecieved.updatedChat.latestMessage;
        // Update chatList state
        setChatList(updatedChatList);
      } else {
        const foundChatIndex = currentChatList.findIndex(
          (chat) => chat._id === newMessageRecieved.message.chatId._id
        );
        if (foundChatIndex !== -1) {
          // Chat object found in chatList
          const updatedChatList = [...currentChatList];
          if (updatedChatList[foundChatIndex].unseenMessageCount >= 1) {
            updatedChatList[foundChatIndex].unseenMessageCount += 1;
          } else {
            updatedChatList[foundChatIndex].unseenMessageCount = 1;
          }
          updatedChatList[foundChatIndex].latestMessage =
            newMessageRecieved.updatedChat.latestMessage;
          // Update chatList state
          setChatList(updatedChatList);
          socket.emit("messageDelivered", {
            messageId: newMessageRecieved.message._id,
            chatId: newMessageRecieved.message.chatId._id,
            senderId: newMessageRecieved.message.sender._id,
            recipientId: user._id
          });
          notification();
        } else {
          // Chat object not found in chatList, handle as needed
          console.log("Chat not found in chatList.");
        }
      }
    });

    socket.on("Seen Received", ({ messageId, chatId, senderId , recipientId }) => {
      if (
        selectedChatCompare &&
        selectedChatCompare.chatId === chatId
      ) {
        const foundMessageIndex = currentAllMessages.findIndex(
          (msg) => msg._id === messageId
        );
        if (foundMessageIndex !== -1) {
          // Chat object found in chatList
          const updatedMessageList = [...currentAllMessages];
          let targetRecipient =  updatedMessageList[foundMessageIndex].recipients.find((recipient) => recipient.user._id === recipientId);
          targetRecipient.status = 'seen';
          setAllMessages(updatedMessageList);
          const tempChatIndex = currentChatList.findIndex(
            (chat) => chat._id === chatId
          );
          let tempChatList = [...currentChatList];
          targetRecipient = tempChatList[tempChatIndex].latestMessage.recipients.find((recipient) => recipient.user._id === recipientId);
         
          targetRecipient.status = 'seen';
  
          setChatList(tempChatList);
        }
      } else {
        const tempChatIndex = currentChatList.findIndex(
          (chat) => chat._id === chatId
        );
        let tempChatList = [...currentChatList];
        let targetRecipient = tempChatList[tempChatIndex].latestMessage.recipients.find((recipient) => recipient.user._id === recipientId);
       
        targetRecipient.status = 'seen';

        setChatList(tempChatList);
      }
      
    });

    socket.on(
      "messageDeliveredAcknowledged",
      ({ messageId, chatId, senderId , recipientId }) => {
        if (selectedChatCompare && selectedChatCompare.chatId === chatId) {
          const foundMessageIndex = currentAllMessages.findIndex(
            (msg) => msg._id === messageId
          );
          if (foundMessageIndex !== -1) {
            // Chat object found in chatList
            const updatedMessageList = [...currentAllMessages];
            let targetRecipient =  updatedMessageList[foundMessageIndex].recipients.find((recipient) => recipient.user._id === recipientId);
            targetRecipient.status = 'delivered';
            setAllMessages(updatedMessageList);
            const tempChatIndex = currentChatList.findIndex(
              (chat) => chat._id === chatId
            );
            let tempChatList = [...currentChatList];
            targetRecipient = tempChatList[tempChatIndex].latestMessage.recipients.find((recipient) => recipient.user._id === recipientId);
           
            targetRecipient.status = 'delivered';
    
            setChatList(tempChatList);
          }
        }else{
          const tempChatIndex = currentChatList.findIndex(
            (chat) => chat._id === chatId
          );
          let tempChatList = [...currentChatList];
          let targetRecipient = tempChatList[tempChatIndex].latestMessage.recipients.find((recipient) => recipient.user._id === recipientId);
         
          targetRecipient.status = 'delivered';
  
          setChatList(tempChatList);
        }
      }
    );
    // eslint-disable-next-line
  }, [socket]);

  return (
    <>
      {selectedChat ? (
        <div className={style.chatBoxContainer}>
          <nav className={style.chatBoxNav}>
            <div className={style.userInfoBox}>
              <div className={style.imgBox}>
                <img src={selectedChat.connectedUserPic} alt="DP" />
              </div>
              <div>
                <span>{selectedChat.connectedUserName}</span>
              </div>
            </div>
            <div className={style.iconBox}>
              <MenuIcon />
            </div>
          </nav>

          <div className={style.messageBox}>
            <span className={style.backgroundImage}></span>
           {isMessagesLoading? <div className={style.loading}><Loading/></div>: <div id="messageBoxContent" className={style.messageBoxContent}>
              <ScrollableMessages messages={allMessages} />
            </div>}
          </div>

          <div>
            <MessageInputBox selectedChat={selectedChat} socket={socket} />
          </div>
        </div>
      ) : (
        <div className={style.infoContainer}>
         
            <div className={style.imgwrapperBox}>
              <img src="https://res.cloudinary.com/dgxvtemh2/image/upload/v1714746439/whatsappClone/whatsapp_2_iaewdc.png" alt="Whatsapp clone logo" />
            </div>
            <div className={style.txtwrapperBox}>
              <h2>Welcome to WhatsApp Clone!</h2>
              <p>This application is a WhatsApp clone developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack by <strong>Pratyush Namdev </strong> .</p>
            </div>
         
         
        </div>
      )}
    </>
  );
}
