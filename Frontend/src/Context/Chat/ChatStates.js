import React, { useState, useContext } from "react";
import LoadingContext from "../Loading/LoadingContext";
import ChatContext from "./ChatContext";
import { toast } from "react-hot-toast";
import HOST from "../../Helper/host";
import apiEndpoints from "../../Helper/apiEndpoints";
import SocketContext from "../Socket/SocketContext";
import AuthContext from "../Authentication/AuthContext";

const ChatState = (props) => {
  const {socket} = useContext(SocketContext);
  const {userId} = useContext(AuthContext)
  const { setIsLoading } = useContext(LoadingContext);
  // * state to check weather user is logged in or not
  const [searchUserModel, setSearchUserModel] = useState(false);
  const [chatList, setChatList] = useState(null);

  const [searchUserResults, setSearchUserResults] = useState(null);
  
  const [selectedChat , setSelectedChat] = useState(null);
  const [totalMessages , setTotalMessages]= useState(0);
  const [allMessages , setAllMessages] = useState([]);
const searchUser = async (query) => {
    setIsLoading(false);
    try {
      const response = await fetch(
        `${HOST}${apiEndpoints.user.searchUser}${query}`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            authToken: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data?.error) {
        throw data.message;
      }
      console.log(data.users)
      setSearchUserResults(data.users);
    } catch (e) {
      setIsLoading(false);
      toast.error(e);
    }
};
const fetchChats = async ()=>{
   
    try {
      const response = await fetch(
        `${HOST}${apiEndpoints.chat.fetchChats}`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            authToken: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data?.error) {
        throw data.message;
      }
      console.log(data.chats)
      setChatList(data.chats)
    } catch (e) {
      
      toast.error(e);
    }
  }
const createChat = async (id) =>{
   
   // Check if the id exists in the users array of any chat object in chatList
   const isIdPresent = chatList.some(chat => chat.users.some(user => user._id === id));

   // If id is already present, return without making the API call
   if (isIdPresent) {
    
     return;
   }
 

  try {
    const response = await fetch(
      `${HOST}${apiEndpoints.chat.createChat}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
        body: JSON.stringify({userId : id})
      }
    );
    const data = await response.json();
    if (data?.error) {
      throw data.message;
    }
    console.log(data.chat)
    setChatList((prevChat)=>[data.chat , ...prevChat]);
    setSearchUserModel(false)
  } catch (e) {
    toast.error(e);
  }
}
const fetchMessages = async (chatId , socket) =>{
  setAllMessages([])
  try {
    const response = await fetch(
      `${HOST}${apiEndpoints.messages.fetchMessages}${chatId}`,
      {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    if (data?.error) {
      throw data.message;
    }
  console.log(data);
 
  socket.emit("join chat", chatId);
  data.messages.reverse();
  setAllMessages(data.messages);
   
  } catch (e) {
    toast.error(e);
  }
}
const messageSeen = async (message)=>{
  try {
    console.log(socket)
    const response = await fetch(
      `${HOST}${apiEndpoints.messages.messageSeen}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
        body: JSON.stringify({messages : message})
      }
    );
    const data = await response.json();
    if (data?.error) {
      messageSeen(message);
    }
     const chatId = message[0].chatId._id
   
    const foundChatIndex = chatList.findIndex(chat => chat._id === chatId);
   
      const updatedChatList = [...chatList];
      updatedChatList[foundChatIndex].unseenMessageCount = 0;
      setChatList(updatedChatList);
      socket.emit("messageSeen" , {userId , messages:data.seenMessages})
       console.log(data?.seenMessages)
  } catch (e) {
    toast.error(e);
  }
}
  return (
    <ChatContext.Provider
      value={{
        searchUserModel,
        searchUserResults,
        chatList,
        totalMessages,
        selectedChat,
        allMessages,
        //chat state value functions
        setSearchUserModel,
        setSearchUserResults,
        setAllMessages,
        setTotalMessages,
        setSelectedChat,
        setChatList,
        
        // api calls
        searchUser,
        fetchChats,
        createChat,
        fetchMessages,
        messageSeen
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
export default ChatState;
