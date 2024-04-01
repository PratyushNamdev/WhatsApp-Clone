import React, { useContext, useEffect } from "react";
import ChatList from "../Components/Chat/ChatList";
import ChatBox from "../Components/Chat/ChatBox";
import AuthContext from "../Context/Authentication/AuthContext";
import style from "../CSS/Home.module.css";
import io from "socket.io-client";
import SocketContext from "../Context/Socket/SocketContext";

export default function Home() {
  const { setUser } = useContext(AuthContext);
  const {socket , setSocket } = useContext(SocketContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // setTimeout(() => {
    //   socket.emit("new message", "ho gayi teri ballex2 ho jayegi balle balle");
    // }, 4000);

    // socket.on("newMessageReceived", (payload) => {
    //   console.log(payload);
    // });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.homeContainer}>
      <div className={style.chatListContainer}>
        {socket && <ChatList  />}
      </div>
      <div className={style.chatBoxContainer}>
        {socket && <ChatBox  />}
      </div>
    </div>
  );
}
