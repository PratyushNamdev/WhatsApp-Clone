import React, { useContext, useState , useRef} from "react";
import style from "../../CSS/SideBar.module.css";
import ChatContext from "../../Context/Chat/ChatContext";
import { BackIcon } from "../../Helper/icons";

export default function SearchUser({ searchUserModel, setSearchUserModel }) {
  const {
    searchUser,
    searchUserResults,
    setSearchUserResults,
    createChat,
  } = useContext(ChatContext);
  const [query, setQuery] = useState("");
  function debounce(func, delay) {
    let timerId;
    return function() {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }
  const debounceSearchUserRef = useRef();
  if (!debounceSearchUserRef.current) {
    debounceSearchUserRef.current = debounce(searchUser, 600);
  }
  
  
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setSearchUserResults(null);
      return;
    }

    debounceSearchUserRef.current(e.target.value);
  };
  return (
    <section
      className={`${style.editSidebar} ${searchUserModel && style.active}`}
    >
      <div className={style.closeIconWrapper}>
        <span
          onClick={() => {
            setSearchUserModel(false);
          }}
        >
          <BackIcon color={"#F0F0F0"} />
        </span>
        <div>Search User</div>
      </div>

      <div className={style.sideBarBody}>
        <div className={style.searchBox}>
          <input type="text" value={query} onChange={handleQueryChange} />
        </div>

        <div>
          {searchUserResults &&
            searchUserResults.map((user) => {
            let userEmail = user.email.length > 20 ? user.email.substring(0, 20) + "..." : user.email;
              return (
                <div
                  className={style.searchResultsContainer}
                  onClick={() => {
                    createChat(user._id , setSearchUserModel);
                  }}
                >
                  <div className={style.imgBox}>
                    <img src={user.profilePic.url} alt="profile Pic" />
                  </div>
                  <div className={style.info}>
                    <span>{user.userName}</span> <br />
                    <span className={style.email}>{userEmail}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
