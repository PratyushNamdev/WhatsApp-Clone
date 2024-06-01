import React from "react";
import { CloseIcon } from "../../Helper/icons";
import style from "../../CSS/DisplayProfilePic.module.css"

export default function DisplayProfilePic({ src, alt, onClose , name}) {
  return (
    <div className={style.displayProfileContainer}>
      <div className={style.closeIconWrapper}>
        <div className={style.info}>
            <div className={style.infoImgBox}><img src={src} alt="DP" /></div>
            <p>{name}</p>
        </div>
          <span onClick={() => onClose()}>
            <CloseIcon />
          </span>
      </div>
      <div className={style.imageWrapper}>
        <img src={src} width={"100%"} alt={alt} />
      </div>
    </div>
  );
}
