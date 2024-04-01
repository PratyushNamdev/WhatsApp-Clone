import React, { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../Context/Authentication/AuthContext";
import style from "../../CSS/ChatList.module.css";
import {
  NewChatIcon,
  MenuIcon,
  SearchIcon,
  BackIcon,
} from "../../Helper/icons";
import SearchUser from "../General/SearchUser";
import ChatContext from "../../Context/Chat/ChatContext";
import SingleChat from "./SingleChat";
export default function ChatList() {
  const { user } = useContext(AuthContext);
  const { setSearchUserModel, chatList, fetchChats } = useContext(ChatContext);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  
  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };
  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery);
  };
  const handleSearchQueryClick = () => {
    setIsSearching(true);
  };
  useEffect(() => {
    if (isSearching) {
      searchRef.current.focus();
    } else {
      setSearchQuery("");
    }
  
  }, [isSearching]);

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {user ? (
        <section className={style.chatListContainer}>
          <nav className={style.header}>
            <div>
              <div className={style.imgContainer}>
                {" "}
                <img src={user.profilePic.url} alt="" />{" "}
              </div>
            </div>
            <div className={style.iconContainer}>
              <div
                onClick={() => {
                  
                  setSearchUserModel(true);
                }}
              >
                <NewChatIcon />
              </div>
              <div>
                <MenuIcon />
              </div>
            </div>
          </nav>

          <div className={style.searchBox}>
            <span className={style.searchIconContainer} onClick={toggleSearch}>
              {isSearching ? (
                <BackIcon color={"#25D366"} />
              ) : (
                <SearchIcon color={"#F0F0F0"} />
              )}
            </span>
            <input
              type="text"
              placeholder={isSearching ? "Search..." : "Type here..."}
              value={searchQuery}
              onChange={handleSearchQuery}
              ref={searchRef}
              onClick={handleSearchQueryClick}
            />
          </div>

          <div className={style.chatListing}>
            {chatList ? (
              chatList.map((chat) => {
                //taking the data of the other user from the users of the array
                let chatUser = chat.users.filter((chatUser) => {
                  return user._id !== chatUser._id;
                });
  
                return (
                  <div key={chat._id}>
                    <SingleChat chatUser={chatUser[0]} chatData={chat} />
                  </div>
                );
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
          <SearchUser/>
        </section>
      ) : (
        <div>Loading</div>
      )}
     
    </>
  );
}
