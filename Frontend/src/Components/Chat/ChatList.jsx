import React, { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../Context/Authentication/AuthContext";
import style from "../../CSS/ChatList.module.css";
import {
  NewChatIcon,
  MenuIcon,
  SearchIcon,
  BackIcon,
  CreateGroupIcon,
} from "../../Helper/icons";
import SearchUser from "../General/SearchUser";
import ChatContext from "../../Context/Chat/ChatContext";
import SingleChat from "./SingleChat";
import CreateGroupModel from "../Feature_Components/CreateGroupModel";
import UserProfile from "../General/UserProfile";
export default function ChatList({onViewProfilePic , setImageToCrop}) {
  const { user , logout} = useContext(AuthContext);
  const { chatList, fetchChats } = useContext(ChatContext);

  // * isSearching state is to signify weather user is searching someone in the available chat list 
  const [isSearching, setIsSearching] = useState(false);
  // * searchQuery state is to store the search query entered by the user in the search bar
  const [searchQuery, setSearchQuery] = useState("");
  // * searchRef state is to store the reference of the search bar input element
  const searchRef = useRef(null);
  //* searchUser Model state is to signify weather the search new user model(sidebar) is open or not
  const [searchUserModel, setSearchUserModel] = useState(false);
  //* createGroup Model state is to signify weather the user is making a new group by opening this sidebar
  const [createGroupModel, setCreateGroupModel] = useState(false);
  // * userProfileSideBar state is to signify weather the user is in his profile or in main chat
  const [userProfileSideBar , setUserProfileSideBar] = useState(false);
  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };
  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
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
              <div className={style.imgContainer} onClick={()=> setUserProfileSideBar(true)}>
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
              <div
                onClick={() => {
                  setCreateGroupModel(true);
                }}
              >
                <CreateGroupIcon />
              </div>

              <div className={style.dropdown}>
                <div className={style.dropbtn}>
                  <MenuIcon />
                </div>
                <div className={style.dropdownContent}>
                    <div onClick={logout}  className={style.btnWrapper}><button className={style.btn}>Log Out</button></div>
                </div>
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
                if (chat.isGroupChat === false) {
                  //taking the data of the other user from the users of the array
                  let chatUser = chat.users.filter((chatUser) => {
                    return user._id !== chatUser._id;
                  });

                  return (
                    <div key={chat._id}>
                      <SingleChat chatUser={chatUser[0]} chatData={chat} />
                    </div>
                  );
                } else {
                  return (
                    <div key={chat._id}>
                      <SingleChat chatData={chat} />
                    </div>
                  );
                }
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
          <SearchUser
            searchUserModel={searchUserModel}
            setSearchUserModel={setSearchUserModel}
          />

          <CreateGroupModel
            createGroupModel={createGroupModel}
            setCreateGroupModel={setCreateGroupModel}
          />

          <UserProfile
             userProfileSideBar={userProfileSideBar}
             setUserProfileSideBar = {setUserProfileSideBar}
             onViewProfilePic = {onViewProfilePic}
             setImageToCrop={setImageToCrop}
          />
        </section>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}
