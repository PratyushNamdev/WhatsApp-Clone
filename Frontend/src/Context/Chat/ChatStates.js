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
  const {userId , setIsLoggedIn , setUser , setUserId , setEmail} = useContext(AuthContext)
  const { setIsLoading } = useContext(LoadingContext);
  
  // * data of searched users 
  const [searchUserResults, setSearchUserResults] = useState(null);
  
  // * the list of fetched chats 
  const [chatList, setChatList] = useState(null);
  
  // * The current chat open in the chatBox
  const [selectedChat , setSelectedChat] = useState(null);
  
  // * The total number of messages in the selectedChat
  const [totalMessages , setTotalMessages]= useState(0);
  
  // * The list of all messages in the selectedChat to rendered in the chatBox
  const [allMessages , setAllMessages] = useState([]);

  // * Loading state during the fetching of the chat messages
  const [isMessagesLoading , setIsMessagesLoading] = useState(false)
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

      if(response.status === 401){

        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setUserId("");
        setEmail("");
        window.location.reload();
      }
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
const createChat = async (id , setSearchUserModel) =>{
   
   // Check if the id exists in the users array of any chat object in chatList
   const isIdPresent = chatList.some(chat => chat.users.some(user => user._id === id));

   // If id is already present, return without making the API call
   if (isIdPresent) {
     setSearchUserModel(false)
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
  setIsMessagesLoading(true);
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

    setIsMessagesLoading(false);
    
    socket.emit("join chat", chatId);
    data.messages.reverse();
    setAllMessages(data.messages);
    
  } catch (e) {
    setIsMessagesLoading(false);
    toast.error(e);
  }
}
const messageSeen = async (message)=>{
  try {
   
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
      return ;
    }
    console.log(data)
     const chatId = message[0].chatId._id
   
    const foundChatIndex = chatList.findIndex(chat => chat._id === chatId);
   
      const updatedChatList = [...chatList];
      updatedChatList[foundChatIndex].unseenMessageCount = 0;
      setChatList(updatedChatList);
      socket.emit("messageSeen" , {userId , messages:data.seenMessages})
       
  } catch (e) {
    toast.error(e);
  }
}


// * GroupChat related api calls
const createGroupChat = async (groupFormData)=>{
  
 try{
  const response = await fetch(
    `${HOST}${apiEndpoints.groupChat.createGroupChat}`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        authToken: localStorage.getItem("token"),
      },
      body: JSON.stringify(groupFormData)
    }
  );
  const data = await response.json();
  if (data?.error) {
    throw data.message;
  }
  console.log(data.chat)
  setChatList((prevChat)=>[data.chat , ...prevChat]);
   return true;
 }catch(e){
    console.log(e);
    toast.error(e);
 }
}

  return (
    <ChatContext.Provider
      value={{
       
        searchUserResults,
        chatList,
        totalMessages,
        selectedChat,
        allMessages,
        isMessagesLoading,
        
        //chat state value functions
        setIsMessagesLoading,
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
        messageSeen,
        createGroupChat
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
export default ChatState;
