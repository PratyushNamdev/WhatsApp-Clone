import React , {useState , useContext} from 'react'
import style from "../../CSS/authentication.module.css";
import AuthContext from '../../Context/Authentication/AuthContext';
export default function Login() {
const {login} = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const handleLogin = (e) => {
    e.preventDefault();
   login(credentials.email, credentials.password);
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className={style.formWrapper}>
    <form className={style.formContainer} onSubmit={handleLogin}>
    
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
         minLength={6}
       />
     </div>
     <div className={style.row}>
       <button type="submit">Submit</button>
     </div>

   </form>
   </div>
  )
}
