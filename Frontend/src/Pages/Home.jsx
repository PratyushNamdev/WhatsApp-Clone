import React, { useContext, useEffect, useState } from "react";
import ChatList from "../Components/Chat/ChatList";
import ChatBox from "../Components/Chat/ChatBox";
import AuthContext from "../Context/Authentication/AuthContext";
import style from "../CSS/Home.module.css";
import io from "socket.io-client";
import SocketContext from "../Context/Socket/SocketContext";
import host from "../Helper/host";
import DisplayProfilePic from "../Components/Feature_Components/DisplayProfilePic";
import CropDP from "../Components/Feature_Components/CropDP";

export default function Home() {
  const { setUser, setUserId } = useContext(AuthContext);
  const { socket, setSocket } = useContext(SocketContext);
  const [fullScreenImageSrc, setFullScreenImageSrc] = useState(null);
  const [displayname, setDisplayName] = useState(null);
  const [imageToCrop , setImageToCrop] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    setUserId(user._id);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const socket = io(host);
    setSocket(socket);

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }

  const handleViewPhoto = (src, name) => {
    setFullScreenImageSrc(src);
    setDisplayName(name);
  };

  const handleCloseFullScreenImage = () => {
    setFullScreenImageSrc(null);
    setDisplayName(null);
  };

  return (
    <div className={style.homeContainer}>
      <div className={style.chatListContainer}>
        {socket && <ChatList onViewProfilePic={handleViewPhoto} setImageToCrop={setImageToCrop}/>}
      </div>
      <div className={style.chatBoxContainer}>{socket && <ChatBox />}</div>
      {fullScreenImageSrc && (
        <div className={style.modal}>
          <DisplayProfilePic
            src={fullScreenImageSrc}
            alt="Profile Pic"
            onClose={handleCloseFullScreenImage}
            name={displayname}
          />
        </div>
      )}
      {imageToCrop && (
        <div className={style.modal}>
          <CropDP imageToCrop={imageToCrop} setImageToCrop={setImageToCrop} />
        </div>
      )}
    </div>
  );
}
