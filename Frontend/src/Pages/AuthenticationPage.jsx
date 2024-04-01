import React, { useState, useContext } from "react";
import AuthContext from "../Context/Authentication/AuthContext";
import Login from "../Components/Auth_Components/Login";
import Signup from "../Components/Auth_Components/Signup";
import style from "../CSS/authentication.module.css";
import OtpInput from "react-otp-input";
import {BackIcon} from "../Helper/icons"
export default function AuthenticationPage() {
  const { isOtpModelOpen , setIsOtpModelOpen ,checkOTP, email,} = useContext(AuthContext);
  const [isSignupActive, setisSignupActive] = useState(true);
  const [otp, setOtp] = useState("");

const verifyOtp = ()=>{
  checkOTP( otp);
}






  return (
    <section className={style.authenticationContainer}>
      {isOtpModelOpen ? (
        <div className={style.authenticationBox}>
          <div className={style.iconContainer} 
          onClick={()=>{
            setIsOtpModelOpen(false)
          }}
          > <BackIcon/></div>
          <div className={style.logoBox}>
            <img
              src="https://res.cloudinary.com/dgxvtemh2/image/upload/v1708272996/whatsappClone/VerifyOTP_2_esqg8m.png"
              alt="verify logo"
            />
            <div>
              <h2>Verify OTP</h2>
           {email && <p>OTP is sent on {email}</p>}
            </div>
          </div>
          <div>
            <div className={style.otpInput}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                containerStyle={style.otpinputcontainer}
                inputStyle={style.otpinput}
                placeholder="xxxx"
              />
            </div>
            <div className={style.verifyBtn}><button onClick={verifyOtp}>Verify</button></div>
          </div>
        </div>
      ) : (
        <div className={style.authenticationBox}>
          <div className={style.logoBox}>
            <img
              src="https://res.cloudinary.com/dgxvtemh2/image/upload/v1708266400/whatsappClone/whatsapp_tcoi3u.png"
              alt="whatsapp logo"
            />
            <h2>WhatsApp Clone</h2>
          </div>
          <div className={style.btnBox}>
            <button
              className={
                isSignupActive ? style.activeButton : style.inactiveButton
              }
              onClick={() => {
                setisSignupActive(true);
              }}
            >
              Sign Up
            </button>
            <button
              className={
                !isSignupActive ? style.activeButton : style.inactiveButton
              }
              onClick={() => {
                setisSignupActive(false);
              }}
            >
              Log In
            </button>
          </div>
          <div className={style.authenticationComponenet}>{isSignupActive ? <Signup /> : <Login />}</div>
        </div>
      )}
    </section>
  );
}
