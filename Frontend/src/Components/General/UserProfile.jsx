import React, { useContext, useState, useEffect, useRef } from "react";
import style from "../../CSS/SideBar.module.css";
import { BackIcon, CameraIcon, PencilIcon, TickIcon } from "../../Helper/icons";
import AuthContext from "../../Context/Authentication/AuthContext";
import { updateUserProfile , deleteProfilePicture} from "../../Services/UserServices/UserProfileService";
export default function UserProfile({
  userProfileSideBar,
  setUserProfileSideBar,
  onViewProfilePic,
  setImageToCrop
}) {
  const { user, setUser } = useContext(AuthContext);
 
  const [name, setName] = useState(user.userName);
  const [about, setAbout] = useState(user.about);
  
  const [showOptions, setShowOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const optionsRef = useRef(null);

  const [nameEditMode, setNameEditMode] = useState(false);
  const [aboutEditMode, setAboutEditMode] = useState(false);
  const handleProfilePicClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteProfilePic = async() => {
     let updatedUser = await deleteProfilePicture();
     console.log(updatedUser)
     if(updatedUser){
     localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
     }
  };

  const handleUploadNewProfilePic = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageToCrop(reader.result);
    };
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
      setIsHovered(false); // Also hide overlay when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };
  const handleKeyPress = (event, callback) => {
    if (event.key === "Enter") {
      callback();
    }
  };

  const submitNewName = async () => {
    if (name.trim() === "" || name.trim() === user.userName) {
      setNameEditMode(false);
      return;
    }
    setNameEditMode(false);
    let updatedUser = await updateUserProfile({ userName: name });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };
  const submitNewAbout = async () => {
    if (about.trim() === "" || about.trim() === user.about) {
      setAboutEditMode(false);
      return;
    }
    setAboutEditMode(false);
    let updatedUser = await updateUserProfile({ about: about });
    console.log(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <>
      <section
        className={`${style.editSidebar} ${userProfileSideBar && style.active}`}
      >
        <div className={style.closeIconWrapper}>
          <span onClick={() => setUserProfileSideBar(false)}>
            <BackIcon color={"#F0F0F0"} />
          </span>
          <div>Profile</div>
        </div>

        <div className={style.sideBarBody}>
          <div style={{ paddingTop: "2em" }}>
            <div
                className={`${style.profileImageBox} ${userProfileSideBar ? style.animate : ''}`}
              onClick={handleProfilePicClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => !showOptions && setIsHovered(false)}
            >
              <img src={user?.profilePic?.url} alt="Profile Pic" />
              <div
                className={`${style.overlay} ${
                  isHovered || showOptions ? style.overlayVisible : ""
                }`}
              >
                <div className={style.overlayText}>
                  <div>
                    <CameraIcon />
                  </div>
                  <p>
                    Change <br />
                    Profile Photo
                  </p>
                </div>
              </div>
            </div>
            {showOptions && (
              <div ref={optionsRef} className={style.options}>
                <p
                  className={style.optionButton}
                  onClick={() => {
                    onViewProfilePic(user.profilePic.url, user.userName);
                  }}
                >
                  View photo
                </p>
                <label className={style.optionButton}>
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleUploadNewProfilePic}
                  />
                </label>
                <p
                  className={style.optionButton}
                  onClick={handleDeleteProfilePic}
                >
                  Remove photo
                </p>
              </div>
            )}
          </div>

          <div  className={`${style.profileInfo} ${userProfileSideBar ? style.animate : ''} `}>
            <div>
              <p className={style.infoHeading}>Your name</p>
              <div className={style.nameInfoContainer}>
                {!nameEditMode && (
                  <div className={style.infoValueWrapper}>
                    <p>{name}</p>
                    <span
                      onClick={() => {
                        if (aboutEditMode) return;
                        setNameEditMode(true);
                      }}
                    >
                      <PencilIcon />
                    </span>
                  </div>
                )}
                {nameEditMode && (
                  <div className={style.editValueWrapper}>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      maxLength={20}
                      onKeyDown={(e) => handleKeyPress(e, submitNewName)}
                    />
                    <span
                      id="nameTickIcon"
                      onClick={() => {
                        submitNewName();
                      }}
                    >
                      <TickIcon />
                    </span>
                  </div>
                )}
                <div>
                  <small>
                    Your name will be visible to everyone and anyone can search
                    you by the username
                  </small>
                </div>
              </div>
            </div>

            <div>
              <p className={style.infoHeading}>About</p>
              {!aboutEditMode && (
                <div className={style.infoValueWrapper}>
                  <p>{about}</p>
                  <span
                    onClick={() => {
                      if (nameEditMode) return;
                      setAboutEditMode(true);
                    }}
                  >
                    <PencilIcon />
                  </span>
                </div>
              )}
              {aboutEditMode && (
                <div className={style.editValueWrapper}>
                  <input
                    type="text"
                    value={about}
                    onChange={handleAboutChange}
                    maxLength={38}
                    onKeyDown={(e) => handleKeyPress(e, () => submitNewAbout)}
                  />
                  <span
                    id="aboutTickIcon"
                    onClick={() => {
                      submitNewAbout();
                    }}
                  >
                    <TickIcon />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
