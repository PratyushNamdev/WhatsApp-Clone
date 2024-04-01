import React, { useState } from "react";
import SocketContext from "./SocketContext";

const SocketState = (props) => {
  const [socket, setSocket] = useState();

  return (
    <SocketContext.Provider
      value={{
        socket, 
        setSocket
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};
export default SocketState;
