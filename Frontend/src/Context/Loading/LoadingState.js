import React, { useState } from "react";
import LoadingContext from "./LoadingContext";

const LoadingState = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading, 
        setIsLoading
      }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};
export default LoadingState;
