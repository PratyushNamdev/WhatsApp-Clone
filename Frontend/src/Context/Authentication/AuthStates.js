import React, { useState , useContext } from "react";
import LoadingContext from "../Loading/LoadingContext"
import AuthContext from "./AuthContext";
import { toast } from "react-hot-toast";
import HOST from "../../Helper/host";
import apiEndpoints from "../../Helper/apiEndpoints";
const AuthState = (props) => {
  const {setIsLoading} = useContext(LoadingContext);
  // * state to check weather user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user , setUser] = useState(null);
  const [isOtpModelOpen, setIsOtpModelOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  //let navigate = useNavigate();

  const signup = async (userName, email, password) => {
     setIsLoading(true);
    console.log(userName , email , password)
    try {
      const response = await fetch(
        `${HOST}${apiEndpoints.authentication.signup}`,
        {
          method: "POST", //using Post method coz we are sending data
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ userName, email, password }),
        }
      );
      const data = await response.json();
      console.log(data)
      if (data?.error) {
        throw (data);
      }
      if (data.needVerificationstatus) {
        setUserId(data.id);
        toast.success("OTP Sent !");
        setIsOtpModelOpen(true);
        setIsLoading(false);
        
        setEmail(email);
      }
    } catch (data) {
      if(Array.isArray(data.message)){

        setIsLoading(false);
        toast.error(data.message[0].msg);
        return
      }
      setIsLoading(false);
      toast.error(data.message);
      console.log(data);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${HOST}${apiEndpoints.authentication.login}`,
        {
          method: "POST", //using Post method coz we are sending data
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data.error) {
        throw (data.message);
      }
      if (data?.needVerificationstatus) {
        setUserId(data.id);
        toast.success("OTP Sent !");
        setIsOtpModelOpen(true);
        setIsLoading(false);
        setEmail(email);
      } else if (data.authToken) {
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("user" , JSON.stringify(data.user))
        toast.success("Login Successful!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            duration: 2000,
          }
        });
       
        setIsLoggedIn(true);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(e);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    toast.success("Logout Successful!", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    setIsLoggedIn(false);
    setIsLoading(false);
  };

  const checkOTP = async (otp) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${HOST}${apiEndpoints.authentication.verifyOTP}`,
        {
          method: "POST", //using Post method coz we are sending data
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ userId, otp }),
        }
      );
      const data = await response.json();
      if (data?.error) {
        throw (data.message);
      }
      if (data?.success) {
       
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("user" , JSON.stringify(data.user))
        setIsLoggedIn(true);
        setIsLoading(false);
        setIsOtpModelOpen(false);
        toast.success("OTP Verified  !", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        setUserId,
        userId,
        checkOTP,
        email,
        isOtpModelOpen,
        setIsOtpModelOpen,
        setEmail,
        user,
        setUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthState;
