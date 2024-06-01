import React, { useContext, useRef, useState } from "react";
import style from "../../CSS/SideBar.module.css";
import { BackIcon, CameraIcon, RightArrowIcon , GroupImageIcon, TickIcon} from "../../Helper/icons";
import ChatContext from "../../Context/Chat/ChatContext";
import AuthContext from "../../Context/Authentication/AuthContext";
export default function CreateGroupModel({
  createGroupModel,
  setCreateGroupModel,
}) {
  
  const [makeGrp, setMakeGrp] = useState(false);
  const { chatList , createGroupChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const profileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const [groupFormData, setGroupFormData] = useState({
    participants: [], // Array of participant IDs
    groupName: '', // Name of the group
    groupDP: null, // Group display picture (image file)
});

  
const handleChatSelection = (chatUserId) => {
 
  // Create a copy of the groupFormData to avoid mutating state directly
  const updatedGroupFormData = { ...groupFormData };

  if (groupFormData.participants.includes(chatUserId)) {
      // If chat is already selected, remove it
      updatedGroupFormData.participants = updatedGroupFormData.participants.filter((id) => id !== chatUserId);
  } else {
      // If chat is not selected, add it
      updatedGroupFormData.participants = [...updatedGroupFormData.participants, chatUserId];
  }
  // Update the groupFormData state with the modified participants array
  setGroupFormData(updatedGroupFormData);
};

  const handleProfileInput = (e) => {
    const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    // Set the base64 string to groupDP in groupFormData
    setGroupFormData({ ...groupFormData, groupDP: reader.result });
    // Set the image state for preview purposes
    setImage(reader.result);
  };
   
  };
  const handleInputRefClick = () => {
    profileInputRef.current.click();
  };
  const handleGroupNameTyping = (e)=>{
    let name = e.target.value;
    setGroupFormData({...groupFormData, groupName: name});
  }
  if (makeGrp) {
    return (
      <section
        className={`${style.editSidebar} ${createGroupModel && style.active}`}
      >
        <div className={style.closeIconWrapper}>
          <span
            onClick={() => {
              setMakeGrp(false);
            }}
          >
            <BackIcon color={"#F0F0F0"} />
          </span>
          <div>New group</div>
        </div>

        <div className={style.sideBarBody}>
          <div style={{padding:"2em 0"}}>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileInput}
              ref={profileInputRef}
              style={{display:"none"}}
            />
            {image !== null ? (
              <div  className={style.profileImageBox} >
                <img src={image} alt="Profile Pic"/>
              </div>
            ) : (   
            <div onClick={handleInputRefClick} className={style.profileImageBox}>
             <div><GroupImageIcon/></div>
              <span className={style.dummyProfileLabel}><CameraIcon/><br /><span>ADD GROUP ICON</span></span>
            </div>
            
            )}
          </div>
          <div className={style.grpNameWrapper}>
            <input type="text" placeholder="Group Subject" value={groupFormData.groupName} onChange={handleGroupNameTyping}/>
          </div>
            <div  className={style.tickIconWrapper}>
              <span
              onClick={ ()=>{
              createGroupChat(groupFormData)
               setCreateGroupModel(false)
               setMakeGrp(false)
               setGroupFormData({
                participants: [], // Array of participant IDs
                groupName: '', // Name of the group
                groupDP: null, // Group display picture (image file)
            })
              }}
              ><TickIcon/></span>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${style.editSidebar} ${createGroupModel && style.active}`}
    >
      <div className={style.closeIconWrapper}>
        <span
          onClick={() => {
            setMakeGrp(false);
            setCreateGroupModel(false);
          }}
        >
          <BackIcon color={"#F0F0F0"} />
        </span>
        <div>Add group members</div>
      </div>

      {chatList && (
        <div className={style.sideBarBody}>
          <ul className={style.selectGrpMemberList}>
            {chatList.map((chat) => {
              if (chat.isGroupChat) {
                return null;
              }
              //taking the data of the other user from the users of the array
              let userArray = chat.users.filter((chatUser) => {
                return user._id !== chatUser._id;
              });
              const chatUser = userArray[0];
              return (
                <li key={chat._id} className={style.liItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={groupFormData.participants.includes(chatUser._id)}
                      onChange={() => handleChatSelection(chatUser._id)}
                    />
                    <div>
                      <div className={style.imgBox}>
                        <img src={chatUser.profilePic.url} alt="profile Pic" />
                      </div>
                      <div>{chatUser.userName}</div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
          {groupFormData.participants.length > 0 && (
            <div className={style.rightArrowBtn}>
              <button
                onClick={() => {
                  setMakeGrp(true);
                }}
              >
                <RightArrowIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
