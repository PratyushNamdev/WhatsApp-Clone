import { useContext, useEffect  } from "react";
import AuthContext from "./Context/Authentication/AuthContext";
import Home from "./Pages/Home";
import AuthenticationPage from "./Pages/AuthenticationPage";

import {Toaster } from "react-hot-toast"
import LoadingContext from "./Context/Loading/LoadingContext";
import Loading from "./Components/General/Loading";

function App() {
  const {isLoading } = useContext(LoadingContext)
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      setIsLoggedIn(false);
    }
    else{
      setIsLoggedIn(true);
    }
    // eslint-disable-next-line
    },[])




  const {isLoggedIn , setIsLoggedIn} = useContext(AuthContext);
  return (
    
    <div >
    {isLoading && <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background with slight darkness
      backdropFilter: 'blur(2px)', // Apply blur effect
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // Ensure it's above other content
  }}><Loading/></div>}
    <Toaster position="top-right"/>
     {isLoggedIn ? <Home/>: <AuthenticationPage/>}
    </div>
  );
}

export default App;
