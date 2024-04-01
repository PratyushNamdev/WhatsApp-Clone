import React, { useContext , useState } from 'react'
import AuthContext from "../../Context/Authentication/AuthContext";
import style from "../../CSS/authentication.module.css"
export default function Signup() {
  const {signup} = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const handleSignup = (e) => {
    e.preventDefault();
    signup(credentials.userName, credentials.email, credentials.password);
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className={style.formWrapper}>
       <form className={style.formContainer} onSubmit={handleSignup}>
       
        <div className={style.row}>
          <input
            placeholder="userName"
            type="text"
            name="userName"
            value={credentials.userName}
            onChange={handleChange}
            required
            // minLength={3}
            autoComplete='off'
          />
        </div>
        <div className={style.row}>
          <input
            placeholder="E-mail"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            autoComplete='on'
          />
        </div>
        <div className={style.row}>
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="off"
            required
            // minLength={6}
          />
        </div>
        <div className={style.row}>
          <button type="submit">Submit</button>
        </div>

      </form>
      </div>
  )
}
