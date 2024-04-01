import React, { useContext, useState } from "react";
import style from "../../CSS/SideBar.module.css";
import ChatContext from "../../Context/Chat/ChatContext";
import { BackIcon } from "../../Helper/icons";
export default function SearchUser() {
  const {
    searchUserModel,
    setSearchUserModel,
    searchUser,
    searchUserResults,
    setSearchUserResults,
    createChat
  } = useContext(ChatContext);
  const [query, setQuery] = useState("");
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    if(e.target.value === ""){
      setSearchUserResults(null)
      return;
    }
    
    searchUser(e.target.value);
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
          {searchUserResults &&  searchUserResults.map((user) => {
            return (
              <div className={style.searchResultsContainer} onClick={()=>{
                createChat(user._id)
              }}>
                <div className={style.imgBox}>
                 <img src={user.profilePic.url} alt="profile Pic" />
                </div>
                <div className={style.info}>
                  <span>{user.userName}</span> <br />
                  <span className={style.email}>{user.email}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
